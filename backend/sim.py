from city import City

city = City()

def update_city():
    city.update_city()
    return city.clock.hour

def get_counts():
    return city.get_counts()

def get_building_counts():
    counts = []
    for buildings in city.city.values():
        for building in buildings:
            counts.append({'id': building.id, 'S': building.sus, 'I': building.inf, 'R': building.rec})
    return counts

def construct_hospitals(num, avgBeds, avgWorkers):
    for i in range(num):
        city.construct_hospital(1, avgBeds, avgWorkers)

def construct_building(typestr, id):
        city.construct_building(typestr, id)

def add_homes(x):
    for i in range(x):
        city.add_home(id=i)