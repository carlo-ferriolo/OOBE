import axios, { AxiosInstance } from "axios";
import qs from "qs";

type AstarteAPIClientProps = {
  astarteUrl: URL;
  realm: string;
  token: string;
};

type Config = AstarteAPIClientProps & {
  appEngineUrl: URL;
};

type CameraHistoryParameters = {
  deviceId: string;
  cameraId: string;
  sinceAfter?: Date;
  since?: Date;
  to?: Date;
  limit?: number;
};

type CameraHistoryData = {
  event: "Person detected" | "Group of people" | "Incident";
  behavior: "Entering" | "Leaving" | "Gathering";
  datetime: Date;
  numberOfPeople: number;
};

class AstarteAPIClient {
  private config: Config;
  private axiosInstance: AxiosInstance;

  constructor({ astarteUrl, realm, token }: AstarteAPIClientProps) {
    this.config = {
      astarteUrl,
      realm,
      token,
      appEngineUrl: new URL("appengine/", astarteUrl),
    };
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

  getCameraIds(deviceId: string): Promise<string[]> {
    const { realm } = this.config;

    return this.axiosInstance
      .get(`v1/${realm}/devices/${deviceId}/interfaces/com.oobe.camera.History`)
      .then((response) => Object.keys(response.data?.data ?? []))
      .catch((error) => {
        throw error;
      });
  }

  getCameraHistory({
    deviceId,
    cameraId,
    sinceAfter,
    since,
    to,
    limit,
  }: CameraHistoryParameters): Promise<CameraHistoryData[]> {
    const { realm } = this.config;

    const query: Record<string, string> = {};

    if (sinceAfter) query.sinceAfter = sinceAfter.toISOString();
    if (since) query.since = since.toISOString();
    if (to) query.to = to.toISOString();
    if (limit) query.limit = limit.toString();

    return this.axiosInstance
      .get(
        `v1/${realm}/devices/${deviceId}/interfaces/com.oobe.camera.History/${cameraId}`,
        { params: query },
      )
      .then((response) => response.data?.data ?? [])
      .catch((error) => {
        throw error;
      });
  }
}

export default AstarteAPIClient;
export type { CameraHistoryData, CameraHistoryParameters };
