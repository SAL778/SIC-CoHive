def jwt_authentication_middleware(get_response):
    def middleware(request):
        # Get the access_token from the cookies
        print("request.COOKIES:")
        access_token = request.COOKIES.get('access_token')
        print("access_token:", access_token)
        
        if access_token:
            # Set the Authorization header with the token
            request.META['HTTP_AUTHORIZATION'] = f'{access_token}'
            # print("HTTP_AUTHORIZATION header set with token:", request.META['HTTP_AUTHORIZATION'])
        
        response = get_response(request)
        return response

    return middleware
