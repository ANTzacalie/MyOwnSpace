import 'dart:async';
import 'dart:io';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'database.dart';
import 'functions.dart';

// Main function - entry point of the app
void main() async {

  WidgetsFlutterBinding.ensureInitialized();

  final db = DatabaseHelper();
  List<Map<String,dynamic>>? connected = await db.getUserCredentials();

  String init = "/login";

  if(connected != null && connected.isNotEmpty) {

    init = "/login3";
    localAddress = connected[0]["ADDRESS"];
    localSessionId = connected[0]["SESSION_ID"];

  }

  if (Platform.isLinux || Platform.isWindows) {

    pathForStorage = await getDownloadsDirectory();

  } else if (Platform.isMacOS) {

    pathForStorage = await getApplicationDocumentsDirectory();

  }

  runApp(MyApp(initialRoute: init)); // This runs the MyApp widget

}

// Root widget of the app
class MyApp extends StatelessWidget {

  final String initialRoute;
  const MyApp({super.key, required this.initialRoute});

  // The build method describes how the widget looks
  @override

  Widget build(BuildContext context) {

    return MaterialApp(
      // App title shown in some platforms
      title: 'My Own Space',

      // Theme of the app (colors, fonts, etc.)
      theme: ThemeData(

        primarySwatch: Colors.orange, // Sets the primary color scheme

      ),

      // The first screen to load when the app starts
      initialRoute: initialRoute,

      // Define routes (a map of screen names to widgets)
      routes: {

        '/login': (context) => _LoginScreen(), // Login screen1
        '/login2': (context) => _LoginScreen2(), // Login screen2
        '/login3': (context) => _LoginScreen3(), // Login screen3
        '/main': (context) => _MainAppScreen(), // Main app screen
        '/settings': (context) => _SettingsScreen(), // Settings screen
        '/about': (context) => _AboutApp(), // About App

      },

    );

  }

}

class _LoginScreen extends StatefulWidget {

  @override
  _LoginScreenDynamic createState() => _LoginScreenDynamic();

}

// LoginScreen: The first phase of the app
class _LoginScreenDynamic extends State<_LoginScreen> {

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController addressController = TextEditingController();
  bool _myButtonHit = false;

  // The build method describes how this screen looks
  @override
  Widget build(BuildContext context) {

    void login(String email , String password , String address) async {

      setState(() {

        _myButtonHit = true;

      });

      String? data = await loginPhase1(email , password , address);

      await Future.delayed(const Duration(seconds: 1));
      setState(() {

        _myButtonHit = false;

      });

      if(data == "True") {

        DatabaseHelper(); // We open for the first time the Database class
        localEmail = email; localAddress = address;

        // Navigate to the MainAppScreen
        Navigator.pushNamed(context, '/login2');

      } else if(data == "False") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("The password/email introduced is wrong or dose not exist."),

            )

        );

      } else if(data == "LOGIN_FAIL"){

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Something went wrong , please check internet connection or try again."),

            )

        );

      } else if(data == "SESSION_LOCK") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Too many tries! , the session has been locked , try again in 15 minutes."),

            )

        );

      } else if(data == "ERROR") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("There was an error in sending the request to the server, try again later."),

            )

        );

      } else if(data == null) {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("No server response, please try again later."),

            )

        );

      }

    }

    return Scaffold(

      backgroundColor: Colors.black, // Background of the scaffold

      // A Scaffold provides basic screen structure
      appBar: AppBar(

        // Top bar title
        title: const Text(

            'My Own Space',
            style: TextStyle(fontSize: 30 , color: Colors.white)

        ),

        backgroundColor: Colors.orange,

      ),

      body: Align( // Centers child widgets in the middle of the screen

        alignment: Alignment.center, // Aligns the body

        child: Column( // Align widgets vertically

          mainAxisAlignment: MainAxisAlignment.start, // Aligns the above child on the main axis
          children: [ // The children layout , it allows multiple objects to exist in it

            const SizedBox(height: 150), // Adds vertical space between widgets

            const Text( // Text on screen

              "Welcome",
              style: TextStyle(color: Colors.orange, fontSize: 35),

            ),

            const SizedBox(height: 80), // Adds vertical space between widgets

            SizedBox( // a sized box that contains a child

              width: 300, // sets the width of the SizedBox

              child: // the child of the SizedBox , the child can contain only one element

                TextField( // TextFiled is a specific widget that allows text input into a bordered layout

                  controller: emailController,
                  style: const TextStyle(color: Colors.orange),

                  decoration: const InputDecoration( // Decoration that is shown around the TextField

                    border: OutlineInputBorder(), // This creates a rectangle around the TextField
                    labelText: "Email", // Label and hint of the TextField

                    labelStyle: TextStyle(color: Colors.white), // Color of the labelText

                    focusedBorder: OutlineInputBorder( // This activates only when user selects the TextFiled , if so the border around will change

                      borderSide: BorderSide( // This is part of the InputOutlineBorder , it affects the rectangle around the TextField

                        color: Colors.green, // Border color when focused
                        width: 2.0, // Width of the line

                      ),

                    ),

                    enabledBorder: OutlineInputBorder(

                        borderSide: BorderSide(

                          color: Colors.white, // Grey border when not focused
                          width: 1.0, // Width of the line

                        )

                    ),

                  ),

                ),

            ),

            const SizedBox(height: 20), // Adds vertical space between widgets

            SizedBox( // a sized box that contains a child

              width: 300, // sets the width of the SizedBox

              child: // the child of the SizedBox , the child can contain only one element

                TextField( // TextFiled is a specific widget that allows text input into a bordered layout

                  obscureText: true,
                  controller: passwordController,
                  style: const TextStyle(color: Colors.orange),

                  decoration: const InputDecoration( // Decoration that is shown around the TextField

                    border: OutlineInputBorder(), // This creates a rectangle around the TextField
                    labelText: "Password", // Label and hint of the TextField

                    labelStyle: TextStyle(color: Colors.white), // Color of the labelText

                    focusedBorder: OutlineInputBorder( // This activates only when user selects the TextFiled , if so the border around will change

                      borderSide: BorderSide( // This is part of the InputOutlineBorder , it affects the rectangle around the TextField

                        color: Colors.green, // Border color when focused
                        width: 2.0, // Width of the line

                      ),

                    ),

                    enabledBorder: OutlineInputBorder(

                        borderSide: BorderSide(

                          color: Colors.white, // Grey border when not focused
                          width: 1.0, // Width of the line

                        )

                    ),

                  ),

              ),

            ),

            const SizedBox(height: 20), // Adds vertical space between widgets

            SizedBox( // a sized box that contains a child

              width: 300, // sets the width of the SizedBox

              child: // the child of the SizedBox , the child can contain only one element

              TextField( // TextFiled is a specific widget that allows text input into a bordered layout

                controller: addressController,
                style: const TextStyle(color: Colors.orange),

                decoration: const InputDecoration( // Decoration that is shown around the TextField

                  border: OutlineInputBorder(), // This creates a rectangle around the TextField
                  labelText: "Server", // Label and hint of the TextField

                  labelStyle: TextStyle(color: Colors.white), // Color of the labelText

                  focusedBorder: OutlineInputBorder( // This activates only when user selects the TextFiled , if so the border around will change

                    borderSide: BorderSide( // This is part of the InputOutlineBorder , it affects the rectangle around the TextField

                      color: Colors.green, // Border color when focused
                      width: 2.0, // Width of the line

                    ),

                  ),

                  enabledBorder: OutlineInputBorder(

                    borderSide: BorderSide(

                      color: Colors.white, // Grey border when not focused
                      width: 1.0, // Width of the line

                    )

                  ),

                ),

              ),

            ),

            const SizedBox(height: 40), // Adds vertical space between widgets

            TextButton.icon( // Icon Button to navigate to the main app screen

              onPressed: _myButtonHit ? null : () {

                if(emailController.text.toString().isNotEmpty && passwordController.text.toString().isNotEmpty && addressController.text.toString().isNotEmpty) {

                  login(

                      emailController.text.toString(),
                      passwordController.text.toString(),
                      addressController.text.toString()

                  );

                } else if(emailController.text.toString().isEmpty) {

                  ScaffoldMessenger.of(context).showSnackBar(

                    const SnackBar(

                      duration: Duration(seconds: 3),
                      content: Text("Email cannot be empty!"),

                    )

                  );

                } else if(passwordController.text.toString().isEmpty) {

                  ScaffoldMessenger.of(context).showSnackBar(

                    const SnackBar(

                      duration: Duration(seconds: 3),
                      content: Text("Password cannot be empty!"),

                    )

                  );

                } else if(addressController.text.toString().isEmpty) {

                  ScaffoldMessenger.of(context).showSnackBar(

                    const SnackBar(

                      duration: Duration(seconds: 3),
                      content: Text("Address cannot be empty!"),

                    )

                  );

                }

              },

              label: Text(

                _myButtonHit ? "Await..." : "Login",

              ),

              icon: _myButtonHit ? const SizedBox(

                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(

                    strokeWidth: 2,
                    color: Colors.white,

                  ),

              ) : const Icon(Icons.login, color: Colors.white),

              style: TextButton.styleFrom(

                foregroundColor: Colors.orange, // Button text/icon color
                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),

              ),

            ),

          ],  // Children

        ),

      ),

    );

  }

}

class _LoginScreen2 extends StatefulWidget {

  @override
  _LoginScreen2Dynamic createState() => _LoginScreen2Dynamic();

}
class _LoginScreen2Dynamic extends State<_LoginScreen2> {

  final TextEditingController codeController = TextEditingController();
  bool _myButtonHit = false;

  // The build method describes how this screen looks
  @override

  Widget build(BuildContext context) {

    void login2(String code) async {

      setState(() {

        _myButtonHit = true;

      });

      Map<String?, String?> data = await loginPhase2(localEmail , localAddress , code);
      await Future.delayed(const Duration(seconds: 1));

      setState(() {

        _myButtonHit = false;

      });

      if(data["RET_VALUE"] == "True") {

        await DatabaseHelper().insertUser(data["SESSION_ID"].toString(), localAddress);
        localSessionId = data["SESSION_ID"].toString();

        // Navigate to the MainAppScreen
        Navigator.pushNamed(context, '/main');

      } else if(data["RET_VALUE"] == "False") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("The entered code is wrong!, please try again."),

            )

        );

      } else if(data["RET_VALUE"] == "RECONNECT") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Session on this ip has expired, you will be redirected back to login!"),

            )

        );
        Navigator.pushNamed(context, '/login');

      } else if(data["RET_VALUE"] == "RECONNECT_CODE") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Verification code has expired, you will be returned to login again."),

            )

        );
        Navigator.pushNamed(context, '/login');

      } else if(data["RET_VALUE"] == "SESSION_LOCK") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Too many tries! , the session has been locked , try again in 15 minutes."),

            )

        );

      } else if(data["RET_VALUE"] == "SC_EMPTY") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Session dose not exist on this IP address, you will be redirected back to login"),

            )

        );
        Navigator.pushNamed(context, '/login');

      } else if(data["RET_VALUE"] == "LOGIN_FAIL"){

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Something went wrong, please check internet connection or try again."),

            )

        );

      } else if(data["RET_VALUE"] == "ERROR") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("There was an error in sending the request to the server, try again later."),

            )

        );

      } else if(data["RET_VALUE"] == null) {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("No server response, please try again later."),

            )

        );

      }


    }

    return Scaffold(

      backgroundColor: Colors.black, // Background of the scaffold

      // A Scaffold provides basic screen structure
      appBar: AppBar(

        // Top bar title
        title: const Text(

            'My Own Space',
            style: TextStyle(fontSize: 30 , color: Colors.white)

        ),

        backgroundColor: Colors.orange,

      ),

      body: Align( // Centers child widgets in the middle of the screen

        alignment: Alignment.center, // Aligns the body

        child: Column( // Align widgets vertically

          mainAxisAlignment: MainAxisAlignment.start, // Aligns the above child on the main axis
          children: [ // The children layout , it allows multiple objects to exist in it

            const SizedBox(height: 150), // Adds vertical space between widgets

            const SizedBox(

                width: 250, // sets the width of the SizedBox
                child:

                    Text( // Text on screen

                        "For security reasons a code was sent to your email address to verify its really you",
                        style: TextStyle(color: Colors.orange, fontSize: 17),

                    ),

            ),

            const SizedBox(height: 60), // Adds vertical space between widgets

            SizedBox( // a sized box that contains a child

              width: 250, // sets the width of the SizedBox

              child: // the child of the SizedBox , the child can contain only one element

              TextField( // TextFiled is a specific widget that allows text input into a bordered layout

                controller: codeController,
                style: const TextStyle(color: Colors.orange),

                decoration: const InputDecoration( // Decoration that is shown around the TextField

                  border: OutlineInputBorder(), // This creates a rectangle around the TextField
                  labelText: "Code", // Label and hint of the TextField

                  labelStyle: TextStyle(color: Colors.white), // Color of the labelText

                  focusedBorder: OutlineInputBorder( // This activates only when user selects the TextFiled , if so the border around will change

                    borderSide: BorderSide( // This is part of the InputOutlineBorder , it affects the rectangle around the TextField

                      color: Colors.green, // Border color when focused
                      width: 2.0, // Width of the line

                    ),

                  ),

                  enabledBorder: OutlineInputBorder(

                      borderSide: BorderSide(

                        color: Colors.white, // Grey border when not focused
                        width: 1.0, // Width of the line

                      )

                  ),

                ),

              ),

            ),


            const SizedBox(height: 40), // Adds vertical space between widgets

            TextButton.icon( // Icon Button to navigate to the main app screen

              onPressed: () {

                if(codeController.text.toString().isNotEmpty) {

                  login2 (

                      codeController.text.toString(),

                  );

                } else if(codeController.text.toString().isEmpty) {

                  ScaffoldMessenger.of(context).showSnackBar(

                      const SnackBar(

                        duration: Duration(seconds: 3),
                        content: Text("Code cannot be empty!"),

                      )

                  );

                }

              },

              label: Text(

                _myButtonHit ? "Await..." : "Verify Code",

              ),

              icon: _myButtonHit ? const SizedBox(

                width: 16,
                height: 16,
                child: CircularProgressIndicator(

                  strokeWidth: 2,
                  color: Colors.white,

                ),

              ) : const Icon(Icons.key, color: Colors.white),

              style: TextButton.styleFrom(

                foregroundColor: Colors.orange, // Button text/icon color
                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),

              ),

            ),

          ],  // Children

        ),

      ),

    );

  }

}

class _LoginScreen3 extends StatefulWidget {

  @override
  _LoginScreen3Dynamic createState() => _LoginScreen3Dynamic();

}

// LoginScreen: The first phase of the app
class _LoginScreen3Dynamic extends State<_LoginScreen3> {

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool _myButtonHit = false;

  // The build method describes how this screen looks
  @override
  Widget build(BuildContext context) {

    void login3(String email , String password) async {

      setState(() {

        _myButtonHit = true;

      });

      String? data = await loginPhase3(email , password , localSessionId);
      await Future.delayed(const Duration(seconds: 1));

      setState(() {

        _myButtonHit = false;

      });

      if(data == "True") {

        localEmail = email;

        // Navigate to the MainAppScreen
        Navigator.pushNamed(context, '/main');

      } else if(data == "False") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("The password/email introduced is wrong or dose not exist."),

            )

        );

      } else if(data == "RECONNECT") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Session on this ip has expired, you will be redirected back to login!"),

            )

        );
        Navigator.pushNamed(context, '/login');

      } else if(data == "SESSION_LOCK") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Too many tries! , the session has been locked , try again in 15 minutes."),

            )

        );

      } else if(data == "LOGIN_FAIL"){

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("Something went wrong, please check internet connection or try again."),

            )

        );

      } else if(data == "ERROR") {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("There was an error in sending the request to the server, try again later."),

            )

        );

      } else if(data == null) {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 3),
              content: Text("No server response, please try again later."),

            )

        );

      }

    }

    return Scaffold(

      backgroundColor: Colors.black, // Background of the scaffold

      // A Scaffold provides basic screen structure
      appBar: AppBar(

        leading: IconButton(

          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () {

            Navigator.pushNamed(context, '/login');

          },

        ),

        // Top bar title
        title: const Text(

            'My Own Space',
            style: TextStyle(fontSize: 30 , color: Colors.white)

        ),

        backgroundColor: Colors.orange,

      ),

      body: Align( // Centers child widgets in the middle of the screen

        alignment: Alignment.center, // Aligns the body

        child: Column( // Align widgets vertically

          mainAxisAlignment: MainAxisAlignment.start, // Aligns the above child on the main axis
          children: [ // The children layout , it allows multiple objects to exist in it

            const SizedBox(height: 150), // Adds vertical space between widgets

            const Text( // Text on screen

              "Welcome",
              style: TextStyle(color: Colors.orange, fontSize: 35),

            ),

            const SizedBox(height: 80), // Adds vertical space between widgets

            SizedBox( // a sized box that contains a child

              width: 300, // sets the width of the SizedBox

              child: // the child of the SizedBox , the child can contain only one element

              TextField( // TextFiled is a specific widget that allows text input into a bordered layout

                controller: emailController,
                style: const TextStyle(color: Colors.orange),

                decoration: const InputDecoration( // Decoration that is shown around the TextField

                  border: OutlineInputBorder(), // This creates a rectangle around the TextField
                  labelText: "Email", // Label and hint of the TextField

                  labelStyle: TextStyle(color: Colors.white), // Color of the labelText

                  focusedBorder: OutlineInputBorder( // This activates only when user selects the TextFiled , if so the border around will change

                    borderSide: BorderSide( // This is part of the InputOutlineBorder , it affects the rectangle around the TextField

                      color: Colors.green, // Border color when focused
                      width: 2.0, // Width of the line

                    ),

                  ),

                  enabledBorder: OutlineInputBorder(

                      borderSide: BorderSide(

                        color: Colors.white, // Grey border when not focused
                        width: 1.0, // Width of the line

                      )

                  ),

                ),

              ),

            ),

            const SizedBox(height: 20), // Adds vertical space between widgets

            SizedBox( // a sized box that contains a child

              width: 300, // sets the width of the SizedBox

              child: // the child of the SizedBox , the child can contain only one element

              TextField( // TextFiled is a specific widget that allows text input into a bordered layout

                obscureText: true,
                controller: passwordController,
                style: const TextStyle(color: Colors.orange),

                decoration: const InputDecoration( // Decoration that is shown around the TextField

                  border: OutlineInputBorder(), // This creates a rectangle around the TextField
                  labelText: "Password", // Label and hint of the TextField

                  labelStyle: TextStyle(color: Colors.white), // Color of the labelText

                  focusedBorder: OutlineInputBorder( // This activates only when user selects the TextFiled , if so the border around will change

                    borderSide: BorderSide( // This is part of the InputOutlineBorder , it affects the rectangle around the TextField

                      color: Colors.green, // Border color when focused
                      width: 2.0, // Width of the line

                    ),

                  ),

                  enabledBorder: OutlineInputBorder(

                      borderSide: BorderSide(

                        color: Colors.white, // Grey border when not focused
                        width: 1.0, // Width of the line

                      )

                  ),

                ),

              ),

            ),

            const SizedBox(height: 40), // Adds vertical space between widgets

            TextButton.icon( // Icon Button to navigate to the main app screen

              onPressed: () {

                if(emailController.text.toString().isNotEmpty && passwordController.text.toString().isNotEmpty) {

                  login3(

                      emailController.text.toString(),
                      passwordController.text.toString()

                  );

                } else if(emailController.text.toString().isEmpty) {

                  ScaffoldMessenger.of(context).showSnackBar(

                      const SnackBar(

                        duration: Duration(seconds: 3),
                        content: Text("Email cannot be empty!"),

                      )

                  );

                } else if(passwordController.text.toString().isEmpty) {

                  ScaffoldMessenger.of(context).showSnackBar(

                      const SnackBar(

                        duration: Duration(seconds: 3),
                        content: Text("Password cannot be empty!"),

                      )

                  );

                }

              },


              label: Text(

                _myButtonHit ? "Await..." : "Access",

              ),

              icon: _myButtonHit ? const SizedBox(

                width: 16,
                height: 16,
                child: CircularProgressIndicator(

                  strokeWidth: 2,
                  color: Colors.white,

                ),

              ) : const Icon(Icons.login, color: Colors.white),

              style: TextButton.styleFrom(

                foregroundColor: Colors.orange, // Button text/icon color
                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),

              ),

            ),

          ],  // Children

        ),

      ),

    );

  }

}

class _MainAppScreen extends StatefulWidget {

  @override
  _MainAppScreenDynamic createState() => _MainAppScreenDynamic();

}

// MainAppScreen: The main phase of the app
class _MainAppScreenDynamic extends State<_MainAppScreen> {

  List<dynamic> data = [];
  bool _myButtonHit = false;

  void fetchData() async {

    Timer.periodic(const Duration(seconds: 5), (timer) async {

      if(kDebugMode) {

        print("5 sec period update on interface");

      }

      final updatedData = await fetchAllFilesNamesServer();

      if (updatedData[0]["RET_VALUE"] != "ERROR" && updatedData[0]["RET_VALUE"] != null && updatedData[0]["RET_VALUE"] == "True") {

        setState(() {

          data = updatedData[1];

        });

      }

    });

  }

  void fetchDataInit() async {

      final updatedData = await fetchAllFilesNamesServer();

      if (updatedData[0]["RET_VALUE"] != "ERROR" && updatedData[0]["RET_VALUE"] != null && updatedData[0]["RET_VALUE"] == "True") {

        setState(() {

          data = updatedData[1];

        });

      } else {

        ScaffoldMessenger.of(context).showSnackBar(

            const SnackBar(

              duration: Duration(seconds: 2),
              content: Text("Error in fetching data from server, check internet connection or try again later!", style: TextStyle(color: Colors.red)),

            )

        );

      }

  }

  void pickFile() async {

    setState(() {
      _myButtonHit = true;
    });

    try {

      FilePickerResult? result = await FilePicker.platform.pickFiles();

      if (result != null) {

        // Gets the selected file
        PlatformFile file = result.files.first;

        // Extract file name without extension
        String fileNameWithoutExtension = getFileNameWithoutExtension(file.name);
        String? fileExtension = file.extension;
        String? fileSize = bytesToMbBase2(file.size).toStringAsFixed(2);
        String? filePath = file.path;

        if (kDebugMode) {

          print("File name: $fileNameWithoutExtension"); // filename without extension
          print("File path: ${file.path}"); // file path
          print("File size: $fileSize mb"); // size in bytes
          print("File extension: ${file.extension}"); //  file extension

        }

        String? send = await addFileServer(file.name , fileNameWithoutExtension, fileExtension, fileSize, filePath);
        await Future.delayed(const Duration(seconds: 1));

        setState(() {
          _myButtonHit = false;
        });

        if(send == "True") {

          ScaffoldMessenger.of(context).showSnackBar(

              SnackBar(

                duration: Duration(seconds: 2),
                content: Text("FILE: ${file.name}  SIZE: $fileSize MB, has been successfully uploaded to server." ),

              )

          );

          fetchDataInit();

        } else if(send == "False") {

          ScaffoldMessenger.of(context).showSnackBar(

              SnackBar(

                duration: Duration(seconds: 2),
                content: Text("Failed to upload file to server, FILE: ${file.name}  SIZE: $fileSize MB.", style: TextStyle(color: Colors.red)),

              )

          );

        } else {

          ScaffoldMessenger.of(context).showSnackBar(

              SnackBar(

                duration: Duration(seconds: 2),
                content: Text("Error in trying to upload file to server!, check internet connection or try again later." ),

              )

          );

        }

      } else {

        // User canceled the picker
        if (kDebugMode) {

          print("File picker was canceled.");

        }

        ScaffoldMessenger.of(context).showSnackBar(

            SnackBar(

              duration: Duration(seconds: 2),
              content: Text("File picker was canceled, no file was selected."),

            )

        );

        setState(() {
          _myButtonHit = false;
        });

      }

    } catch (e) {

      if (kDebugMode) {

        print("Error picking file: $e");

      }

      ScaffoldMessenger.of(context).showSnackBar(

          SnackBar(

            duration: Duration(seconds: 2),
            content: Text("File picker experienced an error!, no file was selected, try again."),

          )

      );

      setState(() {
        _myButtonHit = false;
      });

    }

  }

  double bytesToMbBase2(int bytes) {

    return bytes / 1048576; // Divide by 2^20

  }

  String getFileNameWithoutExtension(String fileName) {

    int lastDotIndex = fileName.lastIndexOf('.');
    return (lastDotIndex != -1) ? fileName.substring(0, lastDotIndex) : fileName;

  }

  void downloadFile(String fileName, String fileType ,String fileId) async {

    bool response = await fetchFileFromServer(fileName, fileType, fileId);

    if(response == true) {

      if(Platform.isAndroid) {

        ScaffoldMessenger.of(context).showSnackBar(

            SnackBar(

              duration: Duration(seconds: 1),
              content: Text(
                  "FILE: $fileName ID: $fileId has been successfully downloaded and placed in /storage/emulated/0/Download.",
                  style: TextStyle(color: Colors.green)),

            )

        );

      } else {

        ScaffoldMessenger.of(context).showSnackBar(

            SnackBar(

              duration: Duration(seconds: 1),
              content: Text(
                  "FILE: $fileName ID: $fileId has been successfully downloaded.",
                  style: TextStyle(color: Colors.green)),

            )

        );

      }

    } else {

      ScaffoldMessenger.of(context).showSnackBar(

          SnackBar(

            duration: Duration(seconds: 2),
            content: Text("FILE: $fileName ID: $fileId has not been downloaded because of an error or not enough privileges to store file, try run admin.", style: TextStyle(color: Colors.red)),

          )

      );

    }

  }

  void renameFile(String fileName, String fileId, String newFileName, String fileSize) async {

    ScaffoldMessenger.of(context).showSnackBar(

        SnackBar(

          duration: Duration(seconds: 1),
          content: Text("Renaming FILE: $fileName SIZE: $fileSize", style: TextStyle(color: Colors.blue)),

        )

    );

    bool response = await renameFileOnServer(fileName, fileId, newFileName);

    if(response) {

      ScaffoldMessenger.of(context).showSnackBar(

          SnackBar(

            duration: Duration(seconds: 1),
            content: Text("FILE: $fileName SIZE: $fileSize has been successfully renamed.", style: TextStyle(color: Colors.green)),

          )

      );

      fetchDataInit();

    } else {

      ScaffoldMessenger.of(context).showSnackBar(

          SnackBar(

            duration: Duration(seconds: 2),
            content: Text("FILE: $fileName SIZE: $fileSize ,failed to rename file on server due to an error.", style: TextStyle(color: Colors.red)),

          )

      );

    }

  }

  void deleteFile(String fileName, String fileId , String fileSize) async {

    bool response = await deleteFileOnServer(fileName, fileId);

    if(response) {

      ScaffoldMessenger.of(context).showSnackBar(

          SnackBar(

            duration: Duration(seconds: 1),
            content: Text("FILE: $fileName SIZE: $fileSize was successfully deleted.", style: TextStyle(color: Colors.orange)),

          )

      );

      fetchDataInit();

    } else {

      ScaffoldMessenger.of(context).showSnackBar(

          SnackBar(

            duration: Duration(seconds: 2),
            content: Text("FILE: $fileName SIZE: $fileSize has not been deleted on server because of an error.", style: TextStyle(color: Colors.red)),

          )

      );

    }


  }


  @override
  void initState() {

    super.initState();
    fetchDataInit();
    fetchData();

  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(

      backgroundColor: Colors.black, // Background of the scaffold

      // App bar at the top of the screen
      appBar: AppBar(

        title: const Text(

            'My Own Space',
            style: TextStyle(fontSize: 30, color: Colors.white)

        ),

        actions: [

          IconButton(

            icon: const Icon(Icons.settings , color: Colors.white), // Settings icon in the app bar

            onPressed: () {

              // Navigate to the settings screen
              Navigator.pushNamed(context, '/settings');

            },

          ),

        ],

        backgroundColor: Colors.orange,

      ),

      // Main content of the screen
      body: Stack(

          children: [

            // main content here , files
            ListView(

              children:

                data.map((item) {

                  String fullDateTime = "NO_DATE";
                  if(item["FILE_DATE"] > 0) {

                    DateTime dateInMilliseconds = DateTime.fromMillisecondsSinceEpoch(item["FILE_DATE"]);
                    fullDateTime = DateFormat('dd/MM/yyyy HH:mm').format(dateInMilliseconds);

                  }

                  return buildCard(

                      item["FILE_NAME"] ?? "NULL_NAME",
                      fullDateTime,
                      item["FILE_TYPE"] ?? "NULL_TYPE",
                      item["FILE_SIZE"] ?? "NULL_SIZE",
                      item["FILE_ID"] ?? "NULL_ID",

                      () {

                        if (kDebugMode) {

                          print('Downloading FILE: ${item['FILE_NAME']} SIZE: ${item['FILE_SIZE']}');

                        }

                        ScaffoldMessenger.of(context).showSnackBar(

                            SnackBar(

                              duration: Duration(milliseconds: 700),
                              content: Text("Downloading FILE: ${item['FILE_NAME']} SIZE: ${item['FILE_SIZE']}", style: TextStyle(color: Colors.green)),

                            )

                        );

                        downloadFile(item["FILE_NAME"], item["FILE_TYPE"] , item["FILE_ID"]);

                      },
                      () {

                        if (kDebugMode) {

                          print("Renaming FILE: ${item['FILE_NAME']} SIZE: ${item['FILE_SIZE']}");

                        }

                        showRenameFileDialog(context, item['FILE_NAME'], (newFileName) {

                          renameFile(item["FILE_NAME"], item["FILE_ID"], newFileName, item["FILE_SIZE"]);

                        },

                        );

                      },
                          () {

                        if (kDebugMode) {

                          print("Deleting FILE: ${item['FILE_NAME']} SIZE: ${item['FILE_SIZE']}");

                        }

                        deleteFileDialog(context, item['FILE_NAME'], (delete) {

                          deleteFile(item['FILE_NAME'] , item['FILE_ID'], item['FILE_SIZE']);

                        },

                        );

                      }

                  );

                }).toList(),

            ),

            // FloatingActionButton with custom position
            Positioned(

              bottom: 60.0,
              right: 40.0,

              child: FloatingActionButton.extended(

                backgroundColor: Colors.orange,
                onPressed: !_myButtonHit ? () {

                  pickFile();

                  if (kDebugMode) {

                    print("File picker opened;");

                  }

                } : null,

                label: Text(

                  _myButtonHit ? "Await..." : "Add",
                  style: TextStyle(color: Colors.white),

                ),

                icon: _myButtonHit ? const SizedBox(

                  width: 16,
                  height: 16,
                  child: CircularProgressIndicator(

                    strokeWidth: 2,
                    color: Colors.white,

                  ),

                ) : const Icon(Icons.add, color: Colors.white),

              ),

            ),

          ],

      ),

    );

  }


  Widget buildCard(String name , String date , String type, String size, String id, VoidCallback onDownload, VoidCallback onRename, VoidCallback onDelete) {

    return Card(

      color: Colors.black,

      child: InkWell(

        onTap: () {

          // Handle card tap, no action required , but needs to be here for splash color to work;

        },

        hoverColor: Colors.grey.withOpacity(0.2), // Hover effect for web/desktop
        splashColor: Colors.grey.withOpacity(0.2), // Splash effect on tap(mobile devices)

        child: ListTile(

          title: Text(name, style: const TextStyle(color: Colors.white, fontSize: 20)),
          subtitle: Text("DATE: $date   TYPE: $type   SIZE: $size   ID: $id", style: TextStyle(color: Colors.lightGreen[700])),

          trailing: PopupMenuButton<String>(

            onSelected: (value) {

              if (value == 'rename') {

                onRename();

              } else if(value == "download") {

                onDownload();

              } else if (value == 'delete') {

                onDelete();

              }

            },

            itemBuilder: (context) => [

              const PopupMenuItem(value: 'download', child: Text('Download', style: TextStyle(color: Colors.green))),
              const PopupMenuItem(value: 'rename', child: Text('Rename', style: TextStyle(color: Colors.blue))),
              const PopupMenuItem(value: 'delete', child: Text('Delete', style: TextStyle(color: Colors.red))),

            ],

            icon: const Icon(Icons.more_vert, color: Colors.white),

          ),

        ),

      ),

    );

  }

  // required keyword must be added if this function becomes external or used by another non build function , the function under used callback( newFileName is the string variable returned by the onRename callback);
  // this function can be made non-void and it will use await in the UI;
  Future<void> showRenameFileDialog(BuildContext context, String initialFileName, Function(String newFileName) onRename) async {

    final TextEditingController controller = TextEditingController(text: initialFileName);

    await showDialog(

      context: context,
      builder: (BuildContext context) {

        return AlertDialog(

          title: Text('Rename File'),
          content: TextField(

            controller: controller,
            decoration: InputDecoration(

              labelText: 'New file name',
              border: OutlineInputBorder(),

            ),

          ),

          actions: [

            TextButton(

              onPressed: () {

                Navigator.of(context).pop(); // Close dialog without action

              },
              child: Text('Cancel', style: TextStyle(color: Colors.red)),

            ),

            TextButton(

              onPressed: () {

                // controller.text.trim() is the text without white spaces
                if (controller.text.trim().isNotEmpty) {

                  onRename(controller.text.trim());
                  Navigator.of(context).pop(); // Close dialog after renaming


                } else {

                  ScaffoldMessenger.of(context).showSnackBar(

                      SnackBar(

                        duration: Duration(milliseconds: 700),
                        content: Text("New file name cannot be empty!", style: TextStyle(color: Colors.red)),

                      )

                  );

                }

              },

              child: Text('Rename', style: TextStyle(color: Colors.green)),

            ),

          ],

        );

      },

    );

  }

  Future<void> deleteFileDialog(BuildContext context, String fileName, Function(bool delete) onDelete) async {

    await showDialog(

      context: context,
      builder: (BuildContext context) {

        return AlertDialog(

          title: Text('Delete File'),
          content: Text(fileName),

          actions: [

            TextButton(

              onPressed: () {

                Navigator.of(context).pop(); // Close dialog without action

              },
              child: Text('Cancel', style: TextStyle(color: Colors.green)),

            ),

            TextButton(

              onPressed: () {

                onDelete(true);
                Navigator.of(context).pop(); // Close dialog after renaming

              },

              child: Text('Delete', style: TextStyle(color: Colors.red)),

            ),

          ],

        );

      },

    );

  }


}

// SettingsScreen: The settings phase of the app
class _SettingsScreen extends StatelessWidget {
  @override

  Widget build(BuildContext context) {

    return Scaffold(

      // App bar for settings
      appBar: AppBar(

        title: const Text(

            'Settings',
            style: TextStyle(fontSize: 30)

        ),

      ),

      body: Center(

        child: Column (

          children: [

            const SizedBox(height: 50),

            Align (

              alignment: Alignment.centerLeft,

              child: TextButton.icon(

                onPressed: () {

                  // Navigate to the settings screen
                  Navigator.pushNamed(context, '/about');

                },

                icon: const Icon(Icons.circle), // The icon
                label: const Text('About the app'), // The text

              ),

            ),

            const SizedBox(height: 15),

            Align (

              alignment: Alignment.centerLeft ,

              child: TextButton.icon(

                onPressed: () {

                  // Navigate to the settings screen
                  //Navigator.pushNamed(context, '/about');

                },

                icon: const Icon(Icons.circle), // The icon
                label: const Text('Get smoked gangsta! '), // The text

              ),

            ),

            const SizedBox(height: 15),

          ],

       ),

      ),

    );

  }

}

class _AboutApp extends StatelessWidget {
  @override

  Widget build(BuildContext context) {

    return Scaffold(

      // App bar for settings
      appBar: AppBar(

        title: const Text(

            'About the app',
            style: TextStyle(fontSize: 30)

        ), // Title of the settings screen

      ),

      body: const Center(

        child: Column(

          mainAxisAlignment: MainAxisAlignment.start,
          children: [

            Text(

              'About the app: ', // Text displayed on the settings screen
              style: TextStyle(fontSize: 38), // Font size for this text

            ),


          ],

        ),

      ),

    );

  }

}

