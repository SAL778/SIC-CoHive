// import sicImage from '../assets/sic.jpg';
import triangleImage from '../assets/triangle.png';
import "./Login.css";
  
export default function Login({}){
    return(
        <>
            <div className="background-container">
                <img src={triangleImage} className="top-image" alt="Triangle" />
            </div>
            <button className="white-button" style={{ top: "calc(274px)" }}>Continue With Google</button>
            <button className="white-button" >Continue as Guest</button>
            <button className="signup-button">Sign Up</button>
            <div className="access-info">All registering users must first be approved by the Student Innovation Center prior to accessing any amenities. The Student Innovation Center is for University students, or University adjacent organizations only.</div>
        </>
    );
}