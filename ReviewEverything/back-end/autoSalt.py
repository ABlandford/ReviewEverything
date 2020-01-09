from pymongo import MongoClient
import bcrypt

client = MongoClient('localhost', 27017)

users = client.data.users

# for user in users.find({}, {"_id": 0, "password" : 1}):
#     # print(user['password'])
#     hashed = bcrypt.hashpw(user['password'].encode('utf8'), bcrypt.gensalt())
#     # print(f'Hashed Password: {hashed}')
#     query = {"password" : f"{user['password']}"}
#     newPass = {"$set" : {"password" : f"{hashed}"}}
#     users.update_one(query, newPass)

# password = users.find_one({'password' : 'y]ed17gqv5'}, {"_id" : 0, "password" : 1})
# print(password)

# hashed = bcrypt.hashpw(password['password'].encode('utf8'), bcrypt.gensalt())
# print(hashed)

password = 'Vf$jzpvL32p2'

user = users.find_one({'fname' : 'Trenton'})
hashword = user['password']
# decodedPass = hashword.decode('utf8')

print(bcrypt.checkpw(password.encode('utf8'), hashword.encode('utf8')))