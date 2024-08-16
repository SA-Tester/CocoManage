from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.utils import timezone

class Signup:
    def __init__(self, database_obj, name, email, password, confirm_password):
        self.email = email
        self.name = name
        self.password = password
        self.confirm_password = confirm_password
        self.database_obj = database_obj

    #validate user inputs
    def validate(self):
        if not self.email or not self.name or not self.password or not self.confirm_password:
            raise ValidationError('All fields are required.')
        
        if User.objects.filter(email=self.email).exists():
            raise ValidationError('The Email already exists. Please use another valid email address.')
        
        if self.password != self.confirm_password:
            raise ValidationError('Passwords do not match.')
        
        if len(self.password) < 6:
            raise ValidationError('Password should contain at least 6 characters.') 

    #create a new user   
    def create_user(self):
        self.validate()
        hashed_password = make_password(self.password)
        user = User.objects.create(username=self.email, email=self.email, password=hashed_password)
        user.first_name = self.name
        user.save()
        return user
    
    #save user data to db
    def save_user_data(self,user):
        user_data = {
            "email": self.email,
            "name": self.name,
            "created_at": timezone.now().isoformat()
        }
        self.database_obj.child('User').child(str(user.id)).set(user_data)

    #generate JWT tokens
    def generate_tokens(self, user):
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return{
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }
    
    #run the process
    def execute(self):
        user = self.create_user()
        self.save_user_data(user)
        tokens = self.generate_tokens(user)
        return tokens