import matplotlib.pyplot as plt
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

susceptible_counts = []
infected_counts = []
recovered_counts = []

city.inject_patient_zero()

for i in range(50):
    for i in range(24):
        city.update_city()
        counts = city.get_counts()
        susceptible_counts.append(counts['susceptible'])
        infected_counts.append(counts['infected'])
        recovered_counts.append(counts['recovered'])


# for types in city.city.keys():
#     for building in city.city[types]:
#         print(building.__str__())

plt.plot(susceptible_counts, label='Susceptible')
plt.plot(infected_counts, label='Infected')
plt.plot(recovered_counts, label='Recovered')
plt.xlabel('Time (updates)')
plt.ylabel('Number of People')
plt.title('Pandemic Simulation in Building')
plt.legend()
plt.show()