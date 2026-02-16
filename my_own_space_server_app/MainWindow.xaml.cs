using Microsoft.Win32;
using System.Data.SQLite;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;

namespace StartInterface 
{

    public partial class MainWindow : Window 
    {

        // FOR NODE.JS;
        private Process? nodeProcess;
        private Process? nodeProcess2;

        // BOOLEAN FOR CHECK_BOX STATE;
        bool allowLogs = false;

        // CONSTANTS FOR THE HINT_TEXT;
        string[] premadeData = ["PATH", "PATH", "PATH", "example@gmail.com", "Its should be a specific password generated for email sending!", "IPV4 adress , as set on router virtual server(port-forward)", "Port number set on virtual server(ex:443)"];

        // R/W TO DB;
        string?[] readArray;
       
        public MainWindow() {
            
            InitializeComponent();

            DatabaseHandler db = new DatabaseHandler();
            readArray = db.ReadData();

            if (readArray[0] is null) { 
            
                readArray = premadeData;
            
            }

            // FIRST TIME INITIALIZING THE TEXT_BOXES;
            SetHintText(PRIVATE_KEY_PATH, readArray[0] , 0);
            SetHintText(CERTIFICATE_PATH, readArray[1] , 1);
            SetHintText(CHAIN_PATH, readArray[2], 2);
            SetHintText(EMAIL, readArray[3], 3);
            SetHintText(EMAIL_PASSWORD, readArray[4], 4);
            SetHintText(SERVER_HOSTNAME, readArray[5], 5);
            SetHintText(SERVER_PORT, readArray[6] , 6);

            // HINT TEXT ADD/REMOVE BASED ON FOCUS;
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
            SERVER_HOSTNAME.GotFocus += RemoveHintText;
            SERVER_HOSTNAME.LostFocus += AddHintText;
            SERVER_PORT.GotFocus += RemoveHintText;
            SERVER_PORT.LostFocus += AddHintText;

        }

        // HERE WE ADD THE HINT TEXT TO THE TEXT_BOXES AT BEGINIG OF APP;
        private void SetHintText(TextBox textBox , string? hintText, int number) 
        {

            textBox.Text = hintText;
            textBox.Tag = premadeData[number];

            if (hintText == premadeData[number]) {

                textBox.Foreground = new SolidColorBrush(Colors.Gray);

            } else {

                textBox.Foreground = new SolidColorBrush(Colors.Black);

            }

        }

        // HERE WE REMOVE THE HINT TEXT;
        private void RemoveHintText(object sender, RoutedEventArgs e) 
        {
            
            TextBox? textBox = sender as TextBox;

            if (textBox != null) {

                if (textBox.Text == (string)textBox.Tag) {

                    textBox.Text = "";
                    textBox.Foreground = new SolidColorBrush(Colors.Black);

                }

            }

        }

        // HERE WE ADD BACK THE HINT TEXT;
        private void AddHintText(object sender, RoutedEventArgs e) 
        {

            TextBox? textBox = sender as TextBox;

            if (textBox != null) {

                if(string.IsNullOrWhiteSpace(textBox.Text)) {

                    textBox.Text = (string)textBox.Tag;
                    textBox.Foreground = new SolidColorBrush(Colors.Gray);

                }

            }
            
        }

        // START BUTTON;
        private void ButtonStart_Click(object sender, RoutedEventArgs e) 
        { 

            DatabaseHandler db = new DatabaseHandler();
            db.UpdateData(PRIVATE_KEY_PATH.Text, CERTIFICATE_PATH.Text, CHAIN_PATH.Text, EMAIL.Text, EMAIL_PASSWORD.Text, SERVER_HOSTNAME.Text, SERVER_PORT.Text);

            if (nodeProcess == null) {

                string appDirectory = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
                string scriptFolder = Path.Combine(appDirectory, "my_own_space_server_code");

                // Server CMD
                nodeProcess = new Process();
                nodeProcess.StartInfo.FileName = "cmd.exe";
                nodeProcess.StartInfo.Arguments = $"/k cd /d \"{scriptFolder}\" && node server.js";
                nodeProcess.StartInfo.UseShellExecute = true;
                nodeProcess.StartInfo.Verb = "runas"; // admin
                if (!allowLogs) nodeProcess.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;

                // DB verify CMD
                nodeProcess2 = new Process();
                nodeProcess2.StartInfo.FileName = "cmd.exe";
                nodeProcess2.StartInfo.Arguments = $"/k cd /d \"{scriptFolder}\" && node db_verify.js";
                nodeProcess2.StartInfo.UseShellExecute = true;
                nodeProcess2.StartInfo.Verb = "runas"; // admin
                if (!allowLogs) nodeProcess2.StartInfo.WindowStyle = ProcessWindowStyle.Hidden;

                // Start with slight delay to avoid race
                nodeProcess.Start();
                Thread.Sleep(500);
                nodeProcess2.Start();


            }

        }

        // STOP BUTTON;
        private void ButtonStop_Click(object sender, RoutedEventArgs e) 
        { 

            if (nodeProcess != null) 
            {
                nodeProcess.Kill();
                nodeProcess = null;
            }

            if (nodeProcess2 != null)
            {
                nodeProcess2.Kill();
                nodeProcess2 = null;
            }
        }

        // TO WINDOW_1;
        private void Admin_Options(object sender, RoutedEventArgs e) 
        {

            Window1 newWindow = new Window1();
            newWindow.ShowDialog();

        }

        // TO WINDOW_2
        private void About_app(object sender, RoutedEventArgs e) 
        {

            Window2 newWindow = new Window2();
            newWindow.ShowDialog();

        }

        // CHECK_BOX STATE FUNCTION;
        private void CheckBoxLog_Click(object sender, RoutedEventArgs e) 
        {

            // IDENTIFIES IF LOG_CHECK_BOX HAVE BEEN CLICKED AND MAKES allowLogs true/false ACCORDINGLY;
            if (allowLogs) {

                allowLogs = false;

            } else {

                allowLogs = true;

            }

        }

        // DETERMINE WHEN IN FOCUS OR NOT;
        private void FocusableArea_MouseLeftButtonDown(object sender, MouseButtonEventArgs e) 
        {

            // SO THAT TEXT HINTS APPEAR AGAIN;
            (sender as UIElement)?.Focus();

        }
        
        private string GetPath() {

            OpenFileDialog openFileDialog = new OpenFileDialog 
            {
                Title = "Select a file",
                Filter = "All files (*.*)|*.*" 
            };

            if (openFileDialog.ShowDialog() == true) 
            {

                return openFileDialog.FileName;

            } else 
            {

                return "ERROR";

            }

        }

        private void BrowseButton_Click1(object sender, RoutedEventArgs e) 
        {

            string path = GetPath();
            PRIVATE_KEY_PATH.Text = path;
            PRIVATE_KEY_PATH.Foreground = new SolidColorBrush(Colors.Black);

        }

        private void BrowseButton_Click2(object sender, RoutedEventArgs e) 
        {

            string path = GetPath();
            CERTIFICATE_PATH.Text = path;
            CERTIFICATE_PATH.Foreground = new SolidColorBrush(Colors.Black);

        }

        private void BrowseButton_Click3(object sender, RoutedEventArgs e) 
        {

            string path = GetPath();
            CHAIN_PATH.Text = path;
            CHAIN_PATH.Foreground = new SolidColorBrush(Colors.Black);

        }

        private void Add_User(object sender, RoutedEventArgs e)
        {

            Window4 newWindow = new Window4();
            newWindow.ShowDialog();

        }

    }

}


public class DatabaseHandler 
{

    private const string ConnectionString = "Data Source=my_own_space_server_code/myOwnSpaceDb.sqlite;Version=3;";

    public DatabaseHandler() 
    {

        InitializeDatabase();

    }

    private void InitializeDatabase() 
    {

        using (var connection = new SQLiteConnection(ConnectionString)) 
        {

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

            using (var command = new SQLiteCommand(createTableQuery, connection)) 
            {

                command.ExecuteNonQuery();

            }

        }

    }

    
    public void UpdateData(string priavtePath , string certificatePath, string chainPath, string email , string password, string hostname, string port) 
    {

        using (var connection = new SQLiteConnection(ConnectionString)) 
        {

            connection.Open();
            string insertQuery = "UPDATE INPUT SET PRIVATE_PATH = @prvPath , CERTIFICATE_PATH = @certPath , CHAIN_PATH = @chainPath , EMAIL = @email , PASSWORD = @password , HOSTNAME = @hostname , PORT = @port WHERE Id = 1";

            using (var command = new SQLiteCommand(insertQuery, connection)) 
            {

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


    public string?[] ReadData() 
    {

        string?[] readArray = { null, null, null, null, null, null, null };

        using (var connection = new SQLiteConnection(ConnectionString)) 
        {

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
            catch 
            { 
                
                MessageBox.Show("Error reatriving stored info form database, try running the application as administrator."); 
           
                return readArray; 
            
            }

        }

    }

 
    public static string Sha512(string input)
    {

        using (var sha = SHA512.Create())
        {

            byte[] bytes = Encoding.UTF8.GetBytes(input);
            byte[] hash = sha.ComputeHash(bytes);
            return BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();

        }

    }   


public bool AddUser(string email, string passwordRaw)
    {

        try {

            using (var connection = new SQLiteConnection(ConnectionString))
            {
                string password = Sha512(passwordRaw); // making the string password as a sha512 hash;

                connection.Open();
                string insertQuery = "INSERT INTO users (EMAIL,PASSWORD) VALUES(@email, @password)";

                using (var command = new SQLiteCommand(insertQuery, connection))
                {

                    command.Parameters.AddWithValue("@email", email);
                    command.Parameters.AddWithValue("@password", password);


                    command.ExecuteNonQuery();

                }

                return true;

            }

        } catch {

            MessageBox.Show("Failed to add user in database, try running the application as administrator.");
            return false;

        }

    }

    public bool RemoveUser(string? email)
    {

        try {

            using (var connection = new SQLiteConnection(ConnectionString))
            {

                connection.Open();
                string insertQuery = "DELETE FROM users WHERE EMAIL = @email";

                using (var command = new SQLiteCommand(insertQuery, connection))
                {

                    command.Parameters.AddWithValue("@email", email);
                    command.ExecuteNonQuery();

                }

                return true;

            }

        } catch {

            MessageBox.Show("Failed to remove user from database, try running the application as administrator.");
            return false;

        }

    }

    public List<UserInfo>? ReadUsers()
    {
        
        using (var connection = new SQLiteConnection(ConnectionString))
        {

            connection.Open();
            string selectQuery = "SELECT id,EMAIL from users";

            try
            {
                using (var command = new SQLiteCommand(selectQuery, connection))
                {

                    using (var reader = command.ExecuteReader())
                    {
                        
                        List<UserInfo> users = new List<UserInfo>();

                        while (reader.Read())
                        {

                            users.Add(new UserInfo { Email = reader[1].ToString(), Password = reader[0].ToString() });

                        }

                        return users;

                    }

                }

            }
            catch
            {

                MessageBox.Show("Error reatriving stored info form database, try running the application as administrator.");

                return null;

            }

        }

    }

    public class UserInfo
    {
        public required string? Email { get; set; }
        public required string? Password { get; set; }

    }
}