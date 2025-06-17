import React, { useEffect, useRef, useState } from "react";


const GoogleLogin = ({
  onSuccess,
  onError,
  clientId,
}) => {
  const googleButtonRef = useRef(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [ , setDebugInfo] = useState("");
  useEffect(() => {
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      // Check if already loaded
      if (window.google?.accounts?.id) {
        setIsGoogleLoaded(true);
        setDebugInfo("Google APIs already loaded");
        return;
      }

      if (document.getElementById("google-identity-script")) {
        setDebugInfo("Google script tag exists, waiting for load...");
        return;
      }

      setDebugInfo("Loading Google Identity Services script...");
      const script = document.createElement("script");
      script.id = "google-identity-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setDebugInfo("Google script loaded, checking APIs...");
        // Give it a moment to initialize
        setTimeout(() => {
          if (window.google?.accounts?.id) {
            setIsGoogleLoaded(true);
            setDebugInfo("Google APIs ready");
          } else {
            setDebugInfo("Google script loaded but APIs not ready");
          }
        }, 100);
      };
      script.onerror = () => {
        setDebugInfo("Failed to load Google script");
        onError("Failed to load Google Identity Services");
      };

      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, [onError]);

  useEffect(() => {
    if (isGoogleLoaded && window.google && googleButtonRef.current) {
      setDebugInfo("Google APIs loaded, initializing...");
      const handleCredentialResponse = (response) => {
        try {
          // Decode the JWT token to get user information
          const base64Url = response.credential.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split("")
              .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
              .join("")
          );
          const userInfo = JSON.parse(jsonPayload);

          // Add debugging to see what we receive
          console.log("Received user info from Google:", userInfo);
          console.log("Received user token from Google:", response);

          const user = {
            id: userInfo.sub || "",
            name: userInfo.name || "Unknown User",
            email: userInfo.email || "",
            picture:
              userInfo.picture ||
              "https://via.placeholder.com/150/cccccc/000000?text=User",
          };

          console.log("Processed user object:", user);
          onSuccess(user);
        } catch (error) {
          console.error("Google login processing failed:", error);
          if (onError) {
            onError("Failed to process Google login response");
          }
        }
      };

      // Initialize Google Identity Services
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
      });
    } else {
      if (!isGoogleLoaded) {
        setDebugInfo("Waiting for Google APIs to load...");
      } else if (!window.google) {
        setDebugInfo("Google APIs not available");
      } else if (!googleButtonRef.current) {
        setDebugInfo("Button container not ready");
      }
    }
  }, [isGoogleLoaded, clientId, onSuccess, onError]);

  return (
    <div className="google-login-container">
      <div ref={googleButtonRef} className="google-login-button"></div>
     
    </div>
  );
};

export default GoogleLogin;
