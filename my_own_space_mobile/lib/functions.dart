import 'dart:convert';
import 'package:http_parser/http_parser.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:mime/mime.dart';

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

Future<List<dynamic>> fetchAllFilesNamesServer() async {

  if(kDebugMode) {

    print("Fetching data from server.");

  }

  final data = {"email": localEmail, "session_id": localSessionId};

  try {

    final response = await http.post(

      Uri.parse("$localAddress/fetch/file/names"),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode(data),

    );

    if (response.statusCode == 200) {

      final responseBody = jsonDecode(response.body);
      return responseBody;

    }

  } catch (e) {

    return [{"RET_VALUE": "ERROR"}];

  }


  return [{"RET_VALUE": null}];

}

Future<String?> addFileServer(String fullFileName, String fileName, String? fileType, String fileSize , String? filePath) async {

  try {

    // transfer method and request method (multipart is used for file transfer);
    var request = http.MultipartRequest(

      'POST',
      Uri.parse('$localAddress/upload'),

    );

    //this information is sent as headers because file will not be uploaded with user verification;
    request.headers['email'] = localEmail;  //  email to headers
    request.headers['session_id'] = localSessionId;  //  session_id to headers
    request.headers['file_name'] = fileName;
    request.headers['file_size'] = fileSize;
    request.headers['file_type'] = fileType!;

    // Determine MIME type
    String? mimeType = lookupMimeType(fullFileName); // Dynamically detect MIME type

    // Add the file as a multipart field
    request.files.add(

      await http.MultipartFile.fromPath(

        'file', // Name of the file field in the request, id
        filePath!,
        filename: fullFileName,
        contentType: mimeType != null ? MediaType.parse(mimeType) : null,

      ),

    );

    // Send the request
    var response = await request.send();

    if (response.statusCode == 200) {

      if (kDebugMode) {

        print('File and transport_info uploaded successfully');

      }

      return "True";

    } else {

      if (kDebugMode) {

        print('Failed to upload file and metadata: ${response.statusCode}');

      }

      return "False";

    }

  } catch (e) {

    if (kDebugMode) {

      print('Error uploading file and metadata: $e');

    }

    return "ERROR";

  }

}

Future fetchFileServer() async {



}

Future renameFileServer() async {



}

Future deleteFileServer() async {



}

Future deleteAllFilesServer() async {



}



















