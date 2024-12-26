import 'package:flutter/material.dart';
import 'database.dart';
import 'functions.dart';


// Main function - entry point of the app
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final db = DatabaseHelper();

  List<Map<String,dynamic>>? connected = await db.getUserCredentials();

  String init = "/login";

  if(connected != null && connected.isNotEmpty) {

    //init = "/login3";
    localAddress = connected[0]["ADDRESS"];
    localSessionId = connected[0]["SESSION_ID"];

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

        '/login': (context) => _LoginScreen(), // Login screen
        '/login2': (context) => _LoginScreen2(),
        '/login3': (context) => _LoginScreen3(),
        '/main': (context) => _MainAppScreen(), // Main app screen
        '/settings': (context) => _SettingsScreen(), // Settings screen
        '/about': (context) => _AboutApp(), // About App
        /* MORE ACTIVITIES WILL BE ADDED AS FOR SETTINGS WILL BE FINISHED */

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

      await Future.delayed(const Duration(seconds: 1)); // Adjust the duration as needed
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
                    color: Colors.white, // Adjust color if needed
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
      await Future.delayed(const Duration(seconds: 1)); // Adjust the duration as needed

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
                  color: Colors.white, // Adjust color if needed
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
      await Future.delayed(const Duration(seconds: 1)); // Adjust the duration as needed

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
                  color: Colors.white, // Adjust color if needed
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


// MainAppScreen: The main phase of the app
class _MainAppScreen extends StatelessWidget {
  @override

  Widget build(BuildContext context) {

    return Scaffold(

      // App bar at the top of the screen
      appBar: AppBar(

        title: const Text(

            'My Own Space',
            style: TextStyle(fontSize: 30)

        ),

        actions: [

          IconButton(

            icon: const Icon(Icons.settings), // Settings icon in the app bar

            onPressed: () {

              // Navigate to the settings screen
              Navigator.pushNamed(context, '/settings');

            },

          ),

        ],

      ),

      // Main content of the screen
      body: const Center(

        child: Text(

          'Main App Phase', // Text displayed on the screen
          style: TextStyle(fontSize: 24), // Font size for this text

        ),

      ),

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

