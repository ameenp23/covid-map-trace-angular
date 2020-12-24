// export interface Item {
//   id?: string;
//   title?: string;
//   description?: string;
// }

export interface Item {
  address?: string;
  district?: string;
  geopoint?: geoPoint;
  id?: string;
}

interface geoPoint {
  Pc: Float64Array;
  Vc: Float64Array;
  latitude: Float64Array;
  longitude: Float64Array;
}

export interface Patient {
  hospital?: string;
  name?: string;
  pid?: string;
  src_id?: string;
}
