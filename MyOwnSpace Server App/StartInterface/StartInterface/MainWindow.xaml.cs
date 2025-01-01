using System.Data.SQLite;
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;




/*
 
 * 
 * TODO: THE STOP BUTTON DOSE NOT STOP NODE.JS SERVER , NEED TO FIX IT
 * 
 
*/





namespace StartInterface {

    public partial class MainWindow : Window {

        // FOR NODE.JS
        private Process? nodeProcess;

        // BOOLEAN FOR CHECK_BOX STATE
        bool allowLogs = false;

        // CONSTANTS FOR THE HINT_TEXT
        string[] premadeData= {"PATH","PATH","PATH","example@gmail.com","Its should be a specific password generated for email sending!","IPV4 adress , as set on router virtual server(port-forward)","Port number set on virtual server(ex: 8080)"};

        // R/W TO DB
        string?[] readArray;

        public MainWindow() {

            InitializeComponent();

            DatabaseHandler db = new DatabaseHandler();
            readArray = db.ReadData();

            // FIRST TIME INITIALIZING THE TEXT_BOXES
            SetHintText(PRIVATE_KEY_PATH, readArray[0] , 0);
            SetHintText(CERTIFICATE_PATH, readArray[1] , 1);
            SetHintText(CHAIN_PATH, readArray[2], 2);
            SetHintText(EMAIL, readArray[3], 3);
            SetHintText(EMAIL_PASSWORD, readArray[4], 4);
            SetHintText(SERVER_HOSTNAME, readArray[5], 5);
            SetHintText(SERVER_PORT, readArray[6] , 6);


            // HINT TEXT ADD/REMOVE BASED ON FOCUS
            PRIVATE_KEY_PATH.GotFocus += RemoveHintText;
            PRIVATE_KEY_PATH.LostFocus += AddHintText;
            CERTIFICATE_PATH.GotFocus += RemoveHintText;
            CERTIFICATE_PATH.LostFocus += AddHintText;
            CHAIN_PATH.GotFocus += RemoveHintText;
            CHAIN_PATH.LostFocus += AddHintText;
            EMAIL.GotFocus += RemoveHintText;
            EMAIL.LostFocus += AddHintText;
            EMAIL_PASSWORD.GotFocus += RemoveHintText;
            EMAIL_PASSWORD.LostFocus += AddHintText;
            SERVER_PORT.GotFocus += RemoveHintText;
            SERVER_PORT.LostFocus += AddHintText;
            SERVER_HOSTNAME.GotFocus += RemoveHintText;
            SERVER_HOSTNAME.LostFocus += AddHintText;

        }

        // HERE WE ADD THE HINT TEXT TO THE TEXT_BOXES AT BEGINIG OF APP , THE HINT IS STORED ALOS INTO TEXT_BOX TAG FOR FUTURE USE
        private void SetHintText(TextBox textBox , string? hintText, int number) {

            textBox.Text = hintText;
            textBox.Tag = premadeData[number];

            if (hintText == premadeData[number]) {

                textBox.Foreground = new SolidColorBrush(Colors.Gray);

            } else {

                textBox.Foreground = new SolidColorBrush(Colors.Black);

            }

        }

        // HERE WE REMOVE THE HINT TEXT
        private void RemoveHintText(object sender, RoutedEventArgs e) {

            TextBox? textBox = sender as TextBox;

            if (textBox != null) {

                if (textBox.Text == (string)textBox.Tag) {

                    textBox.Text = "";
                    textBox.Foreground = new SolidColorBrush(Colors.Black);

                }

            }

        }

        // HERE WE ADD BACK THE HINT TEXT
        private void AddHintText(object sender, RoutedEventArgs e) {

            TextBox? textBox = sender as TextBox;

            if (textBox != null) {

                if(string.IsNullOrWhiteSpace(textBox.Text)) {

                    textBox.Text = (string)textBox.Tag;
                    textBox.Foreground = new SolidColorBrush(Colors.Gray);

                }

            }
            
        }

        // START BUTTON 
        private void ButtonStart_Click(object sender, RoutedEventArgs e) { // TODO: ADD THE OTHER db_verify script to run as a process!

            DatabaseHandler db = new DatabaseHandler();
            db.updateData(PRIVATE_KEY_PATH.Text, CERTIFICATE_PATH.Text, CHAIN_PATH.Text, EMAIL.Text, EMAIL_PASSWORD.Text, SERVER_HOSTNAME.Text, SERVER_PORT.Text);

            MessageBox.Show("INPUT HAS BEEN SAVED!");

            if (nodeProcess == null) {

                nodeProcess = new Process();
                nodeProcess.StartInfo.FileName = "cmd.exe";

                // GETS THE CURRENT APP DIRECTORY
                string? appDirectory = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);

                // FULL COMMAND FOR STARTING THE SERVER
                nodeProcess.StartInfo.Arguments = $"/k cd /d \"{appDirectory}\" && node serverMain.js";
                nodeProcess.StartInfo.UseShellExecute = true; // ADMIN PERMISSION
                nodeProcess.StartInfo.Verb = "runas"; // Run as administrator

                if (!allowLogs) {

                    nodeProcess.StartInfo.WindowStyle = ProcessWindowStyle.Hidden; // Hide the command window

                }

                nodeProcess.Start();
                MessageBox.Show("Node.js server started.");

            }

        }

        // STOP BUTTON 
        private void ButtonStop_Click(object sender, RoutedEventArgs e) {

            if (nodeProcess != null) {

                nodeProcess.Kill();
                nodeProcess = null;
                MessageBox.Show("Node.js server stopped.");

            }

        }

        private void Admin_Options(object sender, RoutedEventArgs e) {

            // HERE WE NEED TO OPEN ANOTHER SCREEN , TO DO THE ADMIN STUFF;

        }

        // CHECK_BOX STATE FUNCTION
        private void CheckBoxLog_Click(object sender, RoutedEventArgs e) {

            // IDENTIFIES IF LOG_CHECK_BOX HAVE BEEN CLICKED AND MAKES allowLogs true/false ACCORDINGLY
            if (allowLogs) {

                allowLogs = false;

            } else {

                allowLogs = true;

            }

        }

        private void FocusableArea_MouseLeftButtonDown(object sender, MouseButtonEventArgs e) {

            // THIS IS HERE BECAUSE I NEED THE SPACE BETWEEN THE ELEMENTS TO BE FOCUSABLE , SO THAT TEXT HINTS APPEAR AGAIN
            (sender as UIElement)?.Focus();

        }

    }

}

// ALL DATA_BASE FUNCTIONS
public class DatabaseHandler {

    private const string ConnectionString = "Data Source=DataBaseSQLite.db;Version=3;";

    public DatabaseHandler() {

        InitializeDatabase();

    }

    private void InitializeDatabase() {

        using (var connection = new SQLiteConnection(ConnectionString)) {

            connection.Open();

            string createTableQuery = @"CREATE TABLE IF NOT EXISTS INPUT (

                                            Id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            PRIVATE_PATH TEXT NOT NULL,
                                            CERTIFICATE_PATH TEXT NOT NULL,
                                            CHAIN_PATH TEXT NOT NULL,
                                            EMAIL TEXT NOT NULL,
                                            PASSWORD TEXT NOT NULL,
                                            HOSTNAME TEXT NOT NULL,
                                            PORT TEXT NOT NULL
            );";

            using (var command = new SQLiteCommand(createTableQuery, connection)) {

                command.ExecuteNonQuery();

            }

        }

    }

    // UPDATE FUNCTION
    public void updateData(string priavtePath , string certificatePath, string chainPath, string email , string password, string hostname, string port) {

        using (var connection = new SQLiteConnection(ConnectionString)) {

            connection.Open();
            string insertQuery = "UPDATE INPUT SET PRIVATE_PATH = @prvPath , CERTIFICATE_PATH = @certPath , CHAIN_PATH = @chainPath , EMAIL = @email , PASSWORD = @password , HOSTNAME = @hostname , PORT = @port WHERE Id = 1";

            using (var command = new SQLiteCommand(insertQuery, connection)) {

                command.Parameters.AddWithValue("@prvPath", priavtePath);
                command.Parameters.AddWithValue("@certPath", certificatePath);
                command.Parameters.AddWithValue("@chainPath", chainPath);
                command.Parameters.AddWithValue("@email", email);
                command.Parameters.AddWithValue("@password", password);
                command.Parameters.AddWithValue("@hostname", hostname);
                command.Parameters.AddWithValue("@port", port);

                command.ExecuteNonQuery();
            }

        }

    }

    // READ FUNCTION, THE 7 COLUMN DATA FROM DATA_BASE
    public string?[] ReadData() {

        string?[] readArray = { null, null, null, null, null, null, null };

        using (var connection = new SQLiteConnection(ConnectionString)) {

            connection.Open();
            string selectQuery = "SELECT PRIVATE_PATH , CERTIFICATE_PATH , CHAIN_PATH, EMAIL , PASSWORD, HOSTNAME, PORT FROM INPUT WHERE Id = 1";

            try {
                using (var command = new SQLiteCommand(selectQuery, connection)) {

                    using (var reader = command.ExecuteReader()) {

                        if (reader.Read()) {

                            readArray[0] = reader["PRIVATE_PATH"].ToString();
                            readArray[1] = reader["CERTIFICATE_PATH"].ToString();
                            readArray[2] = reader["CHAIN_PATH"].ToString();
                            readArray[3] = reader["EMAIL"].ToString();
                            readArray[4] = reader["PASSWORD"].ToString();
                            readArray[5] = reader["HOSTNAME"].ToString();
                            readArray[6] = reader["PORT"].ToString();

                            return readArray;

                        } else {

                            return readArray;

                        }

                    }

                }

            }
            catch { 
                
                MessageBox.Show("ERROR REATRIVING STORED INFO FORM DATA_BASE , TRY RUNNING AS ADMIN"); 
           
                return readArray; 
            
            }

        }

    }

}