def jwt_authentication_middleware(get_response):
    def middleware(request):
        # Get the access_token from the cookies
        access_token = request.COOKIES.get('access_token')
        if access_token:
            # Set the Authorization header with the token
            request.META['HTTP_AUTHORIZATION'] = f'{access_token}'
        
        response = get_response(request)
        return response

    return middleware
