from pymongo import MongoClient
import bcrypt

client = MongoClient('localhost', 27017)

users = client.Users.User_Profiles


for user in users.find({}, {"_id" :0, 'password' : ''}):
    global salt 
    global hashed
    # print(user['password'])
    
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(user['password'].encode('utf8'), bcrypt.gensalt())
    print(salt)
    print(hashed)
 

 

# keganstuff = users.find_one({'fname' : 'Kegan'})
# print(keganstuff)