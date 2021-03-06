import axiosClient from './axiosClient';
import { MAIN_URL } from './config';

class ShipmentAPI {
  import = params => {
    const url = MAIN_URL.concat('/current-import');
    return axiosClient.get(url, { params });
  };
  export = params => {
    const url = MAIN_URL.concat('/current-export');
    return axiosClient.get(url, { params });
  };
  shipmentDetail = id => {
    const url = MAIN_URL.concat('/shipments/vehicle-detail/' + id);
    return axiosClient.get(url);
  };
  finishShipment = id => {
    const url = MAIN_URL.concat('/shipments/finish/' + id);
    return axiosClient.put(url);
  };
  shipmentItemDetail = id => {
    const url = MAIN_URL.concat('/shipment-items/' + id);
    return axiosClient.get(url);
  };
}
const shipmentApi = new ShipmentAPI();
export default shipmentApi;
