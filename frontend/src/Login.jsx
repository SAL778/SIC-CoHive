import React, { useEffect, useContext } from "react";
import placeholder from './assets/placeholder-logo.png';
import bg from './assets/sic.jpg';
import pol from './assets/triangle.png'
import "./Login.css";
import { NavigationContext } from "./App.jsx";

export default function Login({}){

    const { setShowNavigation } = useContext(NavigationContext); // Access the context

    useEffect(() => {
        setShowNavigation(location.pathname !== "/");
    }, [location.pathname, setShowNavigation]);

    const googleSignInClick = () => {
        window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id=626444407832-nl2s45p0cmt41rjqkj1o8a71id1tnlo9.apps.googleusercontent.com&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000%2Faccounts%2Fgoogle%2Flogin%2Fcallback%2F&scope=email%20profile&response_type=code&state=1y921DjmsVPVnOgu&access_type=online&service=lso&o2v=2&theme=glif&flowName=GeneralOAuthFlow';
        // window.location.href = 'https://accounts.google.com/v3/signin/identifier?opparams=%253F&dsh=S101567651%3A1709793448770792&access_type=online&client_id=626444407832-nl2s45p0cmt41rjqkj1o8a71id1tnlo9.apps.googleusercontent.com&o2v=2&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Faccounts%2Fgoogle%2Flogin%2Fcallback%2F&response_type=code&scope=email+profile&service=lso&state=Ez5BovCN48oEyxT6&theme=mn&flowName=GeneralOAuthFlow&continue=https%3A%2F%2Faccounts.google.com%2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part%3DAJi8hANc85rL2r8UwOHB0fymkINm8DWx98OIZXq3mNXN1CE9gRsIAAv2KoStOLCstfyAEACI0EEtOjSkyn3btOlGi25_DhYrOQRQJbWe2WMTVyPT6pauIyeej7RoKklzRzPP2jdM19ByY-bpLA3fJ18IZ9DYGE_jRX6PdHDTtMbpNtSN95nfvNS7YnOwvsZZnvxibEOhmcCu-gp8Rj7Nl7hZc3C7-iOhCHMeNyU5QZ7eBeyjoFwtjmGA6lC1Wrp9geis4sIZPax2s9km_STiZjoxBgw5Ts5LQwOTLox3vtsu1VL-8ZaaTxqEhTsjuYX0m4sH6AoFrSADrbVYYZ3GjJuFtmn2iEIvrui7W4_tfSaAKg84OwB6A7fDJe2xI9wj1p0lzGe25kpWqlFH7TUvM48oGzZmSkC25OweOhapnfLkNa2FefFdPjocTGv_Vk7tBNBjNP9nAhr-dOzGbFbw7OEckTc037Ot3A%26flowName%3DGeneralOAuthFlow%26as%3DS101567651%253A1709793448770792%26client_id%3D626444407832-nl2s45p0cmt41rjqkj1o8a71id1tnlo9.apps.googleusercontent.com%26theme%3Dmn%23&app_domain=http%3A%2F%2Flocalhost%3A8000&rart=ANgoxcdFO31iTowJ2xGf8_HaQ2hHrLZaV6XOYwMkh9QfKLUhP4TkrCzZh1fXeWoCBXukUDafs04TJ79vXOPOkHi0J95XD7CPpc_OX69ypi3bStxZ8TWTqLY'
    };
    
    
    const guestSignInClick = () => {
        window.location.href = 'https://accounts.google.com/v3/signin/identifier?ifkv=ATuJsjzq25tjVsV6T3Vhtd4R6edVc518NheNpSOEZFwta10j9CXsekN_qVCMtEBkGrAE9kk1sL0q&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S168177068%3A1708945154223082&theme=glif';
    };

    return(
        <> 
            <img src = {bg} className = "fixed background-container"/>
            <img src = {pol} className="triangle-container" alt="Polygons" />

            <div className="background-container"></div> 
            <img src={placeholder} className="logo object-none" alt="Logo" />
            <div className="loginContainer flex flex-col w-1/4 gap-28 absolute">
                
                <div className="signInButtons flex flex-col gap-4">
                    <button onClick={googleSignInClick}  type="button" className="button-orange rounded-md p-3 shadow-custom text-2xl">
                        <i className="fa-brands fa-google mr-4"/>
                        Continue with Google
                    </button>
                    <button onClick={guestSignInClick} type="button" className="button-orange p-3 rounded-md shadow-custom text-2xl">
                        <i className="fa fa-user mr-4"/>
                        Continue as Guest
                    </button>
                </div>
                <div className="access-info">
                    <p className="access-info text-neutral-400 justify-self-end">
                        All registering users must first be approved by the Student Innovation Center
                        prior to accessing any amenities. The Student Innovation Center is for University
                        students, or University adjacent organizations only.
                    </p>
                </div>
            </div>
        </>
    );
}