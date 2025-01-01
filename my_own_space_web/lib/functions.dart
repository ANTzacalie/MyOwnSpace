import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

// Used at the beginning of the app for the login process , also after for auth3 rec.
String localEmail = "";
String localAddress = "";
String localSessionId = "";

// TODO TEST WITH SERVER!
Future<String?> loginPhase1(String email , String password) async {

  if (kDebugMode) {

    print("Email: $email");
    print("Password: $password");

  }

  final data = {"password": password, "email": email};

  try {

    final response = await http.post(

      Uri.parse("???/authStep1"), // TODO: ADRESA TREBUIE ADAUGAT ATUNCI CAND APLICATIA WEB ESTE LANSATA , DE INVESTIGAT CE TREBUIE FACUT!;
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

Future<Map<String?, String?>> loginPhase2(String email , String code) async {

  if (kDebugMode) {

    print("Email: $email");
    print("Code: $code");

  }

  final data = {"email": email, "security_code": code};

  try {

    final response = await http.post(

      Uri.parse("???/authStep1"), // TODO: ADRESA TREBUIE ADAUGAT ATUNCI CAND APLICATIA WEB ESTE LANSATA , DE INVESTIGAT CE TREBUIE FACUT!;
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

Future<List<dynamic>> fetchAllFilesNames() async {

  //test
  return [ {"RET_VALUE": "SUCCESS"} , [ {"FILE_NAME": "File1" , "FILE_DATE": "29/12/2024" , "FILE_TYPE": "JPG" , "FILE_SIZE": "78MB" , "FILE_ID": "NO_ID"} , {"FILE_NAME": "File2", "FILE_DATE": "29/12/2024" , "FILE_TYPE": "JPG" , "FILE_SIZE": "78MB" , "FILE_ID": "NO_ID"} , {"FILE_NAME": "File3", "FILE_DATE": "29/12/2024" , "FILE_TYPE": "JPG" , "FILE_SIZE": "78MB" , "FILE_ID": "NO_ID"} ] ];

}





















