from pymongo import MongoClient
import bcrypt

client = MongoClient('localhost', 27017)

users = client.Users.User_Profiles


for user in users.find({}, {"_id" :0, 'password' : ''}):
    print(user)



keganstuff = users.find_one({'fname' : 'Kegan'})
print(keganstuff)