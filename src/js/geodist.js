function find(lat1_deg, lon1_deg, lat2_deg, long2_deg){
    const deg2rad = Math.PI / 180;
    const EARTH_RADIUS_KM = 6371.01;
    lat1 = lat1_deg*deg2rad;
    long1 = lon1_deg*deg2rad;
    lat2 = lat2_deg*deg2rad;
    long2 = long2_deg*deg2rad;

    return Math.acos(
        (Math.sin(lat1)*Math.sin(lat2))+
        (Math.cos(lat1)*Math.cos(lat2)*Math.cos(long1-long2))
    )*EARTH_RADIUS_KM;

    };