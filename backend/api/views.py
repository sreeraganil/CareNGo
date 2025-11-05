from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer,BookingSerializer
from .models import User,Booking
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


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
    

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "address": user.address,
            "age": user.age,
            "gender": user.gender,
            "adhaar_number": user.adhaar_number
        }, status=status.HTTP_200_OK)

class BookingView(generics.ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # only show current user’s bookings
        return Booking.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
