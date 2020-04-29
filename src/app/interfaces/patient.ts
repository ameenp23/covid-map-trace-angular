import { RouteMapItem } from './route-map-item';

export interface Patient {
  pid: string,
  src_id: string,
  name: string,
  hospital: string,
  routeMap: RouteMapItem[]
}
