from pymongo import MongoClient
import bcrypt

client = MongoClient('localhost', 27017)

users = client.data.users
oldUsers = client.extraUsers.users

bob = users.find_one({'fname' : 'Bob'})

print(bob)

# for user in users.find({}, {"_id" : 0, "password" : 1}):
#     for oldUser in oldUsers.find({}, {"_id" : 0, "password" : 1}):
#         # password = oldUser['password'].encode('utf8')
#         # matched = bcrypt.hashpw(password, user['password'].encode('utf8')) == user['password']
#         # print(matched)
        
#         print(f"First Password: {oldUser['password']}")
#         hashed = bcrypt.hashpw(oldUser['password'].encode('utf8'), bcrypt.gensalt())
#         print(f'Hashed Password: {hashed}')
#         print("")
#         if bcrypt.checkpw(oldUser['password'].encode('utf8'), hashed):
#             print("It frekin' worked ya dingus.")
#         else:
#             print("F***!")
#         print("")
    # query = {"password" : f"{user['password']}"}
    # newPass = {"$set" : {"password" : f"{hashed}"}}
    # users.update_one(query, newPass)

# password = users.find_one({'password' : 'y]ed17gqv5'}, {"_id" : 0, "password" : 1})
# print(password)

# hashed = bcrypt.hashpw(password['password'].encode('utf8'), bcrypt.gensalt())
# print(hashed)

# password = 'kcyc10)pOl6'

# user = users.find_one({'fname' : 'Larissa'})
# hashword = user['password']
# # decodedPass = hashword.decode('utf8')

# print(bcrypt.checkpw(password.encode('utf8'), hashword.encode('utf8')))