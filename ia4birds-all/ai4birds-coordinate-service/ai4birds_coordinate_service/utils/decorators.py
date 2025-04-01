import jwt
from functools import wraps
from flask import request
from flask_restx import abort
from ai4birds_coordinate_service import config

def require_token():
    """
    Verifica que el token JWT sea válido. No se verifica el rol.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            
            auth_header = request.headers.get("Authorization", "")
            token = auth_header.replace("Bearer ", "")
            
            if not token:
                abort(401, "Token requerido")
            try:
                payload = jwt.decode(token, config.SECRET_KEY, algorithms=["HS256"])
                
                # Verifica que el token tenga el "intent" correcto
                if payload.get("intent") != "access":
                    abort(401, "Token inválido: Intent no válido")

                return func(*args, **kwargs)
            except jwt.ExpiredSignatureError:
                abort(401, "Token expirado")
            except jwt.InvalidTokenError as e:
                abort(401, f"Token inválido: {str(e)}")

        return wrapper
    return decorator
