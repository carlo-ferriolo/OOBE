import axios, { AxiosInstance } from "axios";
import { Channel, Socket } from "phoenix";
import qs from "qs";
import {
  MedicalReportsData,
  PatientOverviewData,
  PatientOverviewDto,
  VitalSignsData,
  VitalSignsDto,
} from "types";

type AstarteAPIClientProps = {
  astarteUrl: URL;
  realm: string;
  token: string;
};

type Config = AstarteAPIClientProps & {
  appEngineUrl: URL;
  socketUrl: URL;
};

type AstarteClientEvent = "socketError" | "socketClose";

async function openNewSocketConnection(
  connectionParams: { socketUrl: string; realm: string; token: string },
  onErrorHandler: () => void,
  onCloseHandler: () => void,
): Promise<Socket> {
  const { socketUrl, realm, token } = connectionParams;

  return new Promise((resolve) => {
    const phoenixSocket = new Socket(socketUrl, {
      params: {
        realm,
        token,
      },
    });
    phoenixSocket.onError(onErrorHandler);
    phoenixSocket.onClose(onCloseHandler);
    phoenixSocket.onOpen(() => {
      resolve(phoenixSocket);
    });
    phoenixSocket.connect();
  });
}

async function joinChannel(
  phoenixSocket: Socket,
  channelString: string,
): Promise<Channel> {
  return new Promise((resolve, reject) => {
    const channel = phoenixSocket.channel(channelString, {});
    channel
      .join()
      .receive("ok", () => {
        resolve(channel);
      })
      .receive("error", (err: unknown) => {
        reject(err);
      });
  });
}

async function leaveChannel(channel: Channel): Promise<void> {
  return new Promise((resolve, reject) => {
    channel
      .leave()
      .receive("ok", () => {
        resolve();
      })
      .receive("error", (err: unknown) => {
        reject(err);
      });
  });
}

async function registerTrigger(
  channel: Channel,
  triggerPayload: object,
): Promise<void> {
  return new Promise((resolve, reject) => {
    channel
      .push("watch", triggerPayload)
      .receive("ok", () => {
        resolve();
      })
      .receive("error", (err: unknown) => {
        reject(err);
      });
  });
}

class AstarteAPIClient {
  private config: Config;
  private axiosInstance: AxiosInstance;
  private phoenixSocket: Socket | null;
  private joinedChannels: {
    [roomName: string]: Channel;
  };

  private listeners: {
    [eventName: string]: Array<() => void>;
  };

  constructor({ astarteUrl, realm, token }: AstarteAPIClientProps) {
    this.config = {
      astarteUrl,
      realm,
      token,
      appEngineUrl: new URL("appengine/", astarteUrl),
      socketUrl: new URL("v1/socket", new URL("appengine/", astarteUrl)),
    };

    this.config.socketUrl.protocol =
      this.config.socketUrl.protocol === "https:" ? "wss:" : "ws:";

    this.phoenixSocket = null;
    this.joinedChannels = {};
    this.listeners = {};

    this.axiosInstance = axios.create({
      baseURL: this.config.appEngineUrl.toString(),
      headers: {
        Authorization: `Bearer ${this.config.token}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      paramsSerializer: function (params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      },
    });
  }

  addListener(eventName: AstarteClientEvent, callback: () => void): void {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    this.listeners[eventName].push(callback);
  }

  removeListener(eventName: AstarteClientEvent, callback: () => void): void {
    const previousListeners = this.listeners[eventName];
    if (previousListeners) {
      this.listeners[eventName] = previousListeners.filter(
        (listener) => listener !== callback,
      );
    }
  }

  private dispatch(eventName: AstarteClientEvent): void {
    const listeners = this.listeners[eventName];
    if (listeners) {
      listeners.forEach((listener) => listener());
    }
  }

  private async openSocketConnection(): Promise<Socket> {
    if (this.phoenixSocket) {
      return Promise.resolve(this.phoenixSocket);
    }

    const { socketUrl, realm, token } = this.config;

    return new Promise((resolve) => {
      openNewSocketConnection(
        { socketUrl: socketUrl.toString(), realm, token },
        () => {
          this.dispatch("socketError");
        },
        () => {
          this.dispatch("socketClose");
        },
      ).then((socket) => {
        this.phoenixSocket = socket;
        resolve(socket);
      });
    });
  }

  async joinRoom(roomName: string): Promise<Channel> {
    const { phoenixSocket } = this;
    if (!phoenixSocket) {
      return new Promise((resolve) => {
        this.openSocketConnection().then(() => {
          resolve(this.joinRoom(roomName));
        });
      });
    }

    const channel = this.joinedChannels[roomName];
    if (channel) {
      return Promise.resolve(channel);
    }

    return new Promise((resolve) => {
      joinChannel(phoenixSocket, `rooms:${this.config.realm}:${roomName}`).then(
        (joinedChannel) => {
          this.joinedChannels[roomName] = joinedChannel;
          resolve(joinedChannel);
        },
      );
    });
  }

  async listenForEvents(
    roomName: string,
    eventHandler: (event: any) => void,
  ): Promise<void> {
    const channel = this.joinedChannels[roomName];
    if (!channel) {
      return Promise.reject(
        new Error("Can't listen for room events before joining it first"),
      );
    }

    channel.on("new_event", (jsonEvent: unknown) => {
      eventHandler(jsonEvent);
    });
    return Promise.resolve();
  }

  async registerVolatileTrigger(
    roomName: string,
    triggerPayload: object,
  ): Promise<void> {
    const channel = this.joinedChannels[roomName];
    if (!channel) {
      return Promise.reject(
        new Error("Room not joined, couldn't register trigger"),
      );
    }

    return registerTrigger(channel, triggerPayload);
  }

  async leaveRoom(roomName: string): Promise<void> {
    const channel = this.joinedChannels[roomName];
    if (!channel) {
      return Promise.reject(
        new Error("Can't leave a room without joining it first"),
      );
    }

    return leaveChannel(channel).then(() => {
      delete this.joinedChannels[roomName];
    });
  }

  get joinedRooms(): string[] {
    const rooms: string[] = [];
    Object.keys(this.joinedChannels).forEach((roomName) => {
      rooms.push(roomName);
    });
    return rooms;
  }

  async getPatientOverview(deviceId: string): Promise<PatientOverviewData> {
    const { realm } = this.config;

    return this.axiosInstance
      .get(
        `v1/${realm}/devices/${deviceId}/interfaces/com.oobe.patient.Overview`,
      )
      .then((response) => {
        const data: PatientOverviewDto = response.data.data;

        return {
          name: data.name,
          age: data.age,
          bloodType: data.blood_type,
          height: data.height,
          phisician: data.phisician,
          weight: data.weight,
          hospitalizationReason: data.hospitalization_reason,
        } as PatientOverviewData;
      })
      .catch((error) => {
        console.error("[API] ERROR", error);
        throw error;
      });
  }

  async getMedicalReports(deviceId: string): Promise<MedicalReportsData[]> {
    const { realm } = this.config;

    return this.axiosInstance
      .get(
        `v1/${realm}/devices/${deviceId}/interfaces/com.oobe.medical.Reports`,
      )
      .then((response) => {
        return response.data.data.report.map((data: MedicalReportsData) => ({
          type: data.type,
          facility: data.facility,
          date: new Date(data.date),
        })) as MedicalReportsData[];
      })
      .catch((error) => {
        console.error("[API] ERROR", error);
        throw error;
      });
  }

  async getVitalSigns(deviceId: string): Promise<VitalSignsData[]> {
    const { realm } = this.config;

    return this.axiosInstance
      .get(`v1/${realm}/devices/${deviceId}/interfaces/com.oobe.vital.Signs`)
      .then((response) => {
        return response.data.data.vital.map((data: VitalSignsDto) => ({
          ecg: data.ecg,
          systolicPressure: data.systolic_pressure,
          diastolicPressure: data.diastolic_pressure,
          oxygenSaturation: data.oxygen_saturation,
          timestamp: new Date(data.timestamp),
        })) as VitalSignsData[];
      })
      .catch((error) => {
        console.error("[API] ERROR", error);
        throw error;
      });
  }
}

export default AstarteAPIClient;
