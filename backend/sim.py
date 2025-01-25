from city import City

city = City()

def construct_hospitals(num, avgBeds, avgWorkers):
    for i in range(num):
        city.construct_hospital(1, avgBeds, avgWorkers)

def construct_restaurants(x):
    for i in range(x):
        city.construct_building('restaurant', 1)

def construct_schools(x):
    for i in range(x):
        city.construct_building('school', 1)

def construct_offices(x):
    for i in range(x):
        city.construct_building('office', 1)

def construct_stores(x):
    for i in range(x):
        city.construct_building('store', 1)

def add_homes(x):
    for i in range(x):
        city.add_home(id=i)