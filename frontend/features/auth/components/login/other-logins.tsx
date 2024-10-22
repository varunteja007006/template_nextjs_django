import React from "react";

import { Button } from "@/components/ui/button";

import { FaGoogle } from "react-icons/fa6";
import MyTooltip from "@/components/ui/custom/MyTooltip";
import axios from "axios";

export default function OtherLogins() {
  async function loginWithGoogle() {
    // axios.get("https://accounts.google.com/o/oauth2/v2/auth", {
    //   params: {
    //     include_granted_scopes: true,
    //     response_type: "token",
    //     state: "",
    //     redirect_uri: "http://localhost:3000",
    //     client_id: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
    //   },
    // });
    /*
     * Create form to request access token from Google's OAuth 2.0 server.
     */
    oauthSignIn();
    function oauthSignIn() {
      // Google's OAuth 2.0 endpoint for requesting an access token
      var oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

      // Create <form> element to submit parameters to OAuth 2.0 endpoint.
      var form = document.createElement("form");
      form.setAttribute("method", "GET"); // Send as a GET request.
      form.setAttribute("action", oauth2Endpoint);

      // Parameters to pass to OAuth 2.0 endpoint.
      var params = {
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        redirect_uri: "http://localhost:3000",
        response_type: "token",
        scope: "https://www.googleapis.com/auth/drive.metadata.readonly",
        include_granted_scopes: "true",
        state: "pass-through value",
      };

      // Add form parameters as hidden input values.
      for (var p in params) {
        if (params.hasOwnProperty(p)) {
          var input = document.createElement("input");
          input.setAttribute("type", "hidden");
          input.setAttribute("name", p);
          input.setAttribute("value", params[p]);
          form.appendChild(input);
        }
      }

      // Add form to page and submit it to open the OAuth 2.0 endpoint.
      document.body.appendChild(form);
      form.submit();
    }
  }

  return (
    <div className="p-2 md:pl-3 md:pr-0 h-full border-l dark:border-none">
      <MyTooltip text={"Sign in with Google"}>
        <Button
          type="button"
          onClick={loginWithGoogle}
          variant={"outline"}
          size={"icon"}
        >
          <FaGoogle />
        </Button>
      </MyTooltip>
    </div>
  );
}
