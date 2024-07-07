import bcrypt

class User:
    def __init__(self, db):
        self.db = db

    def get_user(self, user_id):
        try:
            user_data = self.db.child("User").child(user_id).get().val()
            if user_data:
                name = user_data.get("name", "N/A")
                email = user_data.get("email", "N/A")
                contactNo = user_data.get("contactNo", "N/A")
                position = user_data.get("position", "N/A")
                username = user_data.get("username", "N/A")

                return {
                    "Error": None,
                    "User": {
                        "Name": name,
                        "Email": email,
                        "ContactNo": contactNo,
                        "Position": position,
                        "Username": username
                    }
                }
            else:
                return {"Error": "User not found"}

        except Exception as e:
            return {"Error": str(e)}

    def change_password(self, database_obj, user_id, old_password, new_password):
        try:
            user = database_obj.child("User").child(user_id).get().val()
            
            if 'password' in user and bcrypt.checkpw(old_password.encode(), user['password'].encode()):

                new_password_hashed = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt())
                
                database_obj.child("User").child(user_id).update({"password": new_password_hashed.decode()})
                return {"Error": None, "Message": "Password updated successfully"}
            else:
                return {"Error": "Old password is incorrect"}
            
        except Exception as e:
            return {"Error": str(e)}
