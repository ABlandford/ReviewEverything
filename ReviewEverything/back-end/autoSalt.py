from pymongo import MongoClient
import bcrypt

client = MongoClient('localhost', 27017)

users = client.data.users

# for user in users.find({}, {"_id": 0, "password" : 1}):
#     print(user)

