from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer
from .models import User


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User registered successfully",
                "user": {
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone,
                    "address": user.address,
                    "age": user.age,
                    "gender": user.gender,
                    "adhaar_number": user.adhaar_number,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
