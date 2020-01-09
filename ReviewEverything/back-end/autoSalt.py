from pymongo import MongoClient
import bcrypt

client = MongoClient('localhost', 27017)

users = client.data.users

# for user in users.find({}, {"_id": 0, "password" : 1}):
#     print(user)

password = users.find_one({'password' : 'y]ed17gqv5'}, {"_id" : 0, "password" : 1})
print(password)

hashed = bcrypt.hashpw(password['password'].encode('utf8'), bcrypt.gensalt())
print(hashed)