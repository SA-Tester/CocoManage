import bcrypt

class User:
    def __init__(self, db):
        self.db = db

    def get_user(self, user_id):
        return self.db.child("User").child(user_id).get().val()

    def update_user(self, user_id, data):
        self.db.child("User").child(user_id).update(data)

    def change_password(self, user_id, old_password, new_password):
        user = self.get_user(user_id)
        if 'password' in user and bcrypt.checkpw(old_password.encode(), user['password'].encode()):
            new_password_hashed = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt())
            self.db.child("User").child(user_id).update({"password": new_password_hashed.decode()})
            return True
        return False
