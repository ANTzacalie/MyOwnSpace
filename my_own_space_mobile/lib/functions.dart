import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

// Used at the beginning of the app for the login process , also after for auth3 rec.
String localEmail = "";
String localAddress = "";
String localSessionId = "";

// TODO TEST WITH SERVER!
Future<String?> loginPhase1(String email , String password , String address) async {

  if (kDebugMode) {

    print("Email: $email");
    print("Address: $address");
    print("Password: $password");

  }

  final data = {"password": password, "email": email};

  try {

    final response = await http.post(

      Uri.parse("$address/authStep1"),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),

    );

    if (response.statusCode == 200) {

      final responseBody = jsonDecode(response.body);
      return responseBody["RET_VALUE"]?.toString();

    }

  } catch (e) {

    return "ERROR";

  }

  return null;

}

Future<Map<String?, String?>> loginPhase2(String email , String address , String code) async {

  if (kDebugMode) {

    print("Email: $email");
    print("Address: $address");
    print("Code: $code");

  }

  final data = {"email": email, "security_code": code};

  try {

    final response = await http.post(

      Uri.parse("$address/authStep2"),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),

    );

    if (response.statusCode == 200) {

      final responseBody = jsonDecode(response.body);
      return {"RET_VALUE": responseBody["RET_VALUE"]?.toString(), "SESSION_ID": responseBody["SESSION_ID"]?.toString()};

    }

  } catch (e) {

    return {"RET_VALUE": "ERROR", "SESSION_ID": "EMPTY"};

  }

  return {"RET_VALUE": null, "SESSION_ID": "EMPTY"}; // Return null in case of an server not responding

}

Future<String?> loginPhase3(String email , String password , String sessionId) async {

  if(kDebugMode) {

    print("Email: $email");
    print("Session_id: $sessionId");
    print("Password: $password");

  }

  final data = {"email": email, "password": password , "session_id": localSessionId};

  try {

    final response = await http.post(

      Uri.parse("$localAddress/authStep3"),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),

    );

    if (response.statusCode == 200) {

      final responseBody = jsonDecode(response.body);
      return responseBody["RET_VALUE"]?.toString();

    }

  } catch (e) {

    return "ERROR";

  }

  return null; // Return error in case of an server error

}


