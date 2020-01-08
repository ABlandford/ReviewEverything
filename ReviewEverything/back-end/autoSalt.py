from pymongo import MongoClient

client = MongoClient('localhost', 27017)

users = client.data.users

keganstuff = users.find_one({'fname' : 'Kegan'})
print(keganstuff)