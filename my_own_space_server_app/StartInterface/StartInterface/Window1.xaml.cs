using System.Data.SQLite;
using System.Diagnostics.Eventing.Reader;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;


namespace StartInterface
{
  
    public partial class Window1 : Window
    {

        string[] premadeData = ["10000", "0", "admin_example@gmail.com"];

        // R/W TO DB;
        string?[] readArray = [null, null, null];

        public Window1()
        {

            InitializeComponent();

            DatabaseHandler2 db = new DatabaseHandler2();
            readArray = db.ReadData();

            if (readArray[0] is null) {

                readArray = premadeData;
                
            }

            bool isChecked = false;
            if (readArray[1] == "1") { isChecked = true; };
            SAC_ALLOWED.IsChecked = isChecked;

            SetHintText(EMAIL, readArray[2], 2);
            if (!string.IsNullOrEmpty(readArray[0]) && int.TryParse(readArray[0], out int value))
            {
                SAC_NUMBER.Value = value;
                SAC_NUMBER.Foreground = new SolidColorBrush(Colors.Black);
            }


            EMAIL.GotFocus += RemoveHintText;
            EMAIL.LostFocus += AddHintText;
            SAC_NUMBER.GotFocus += RemoveHintText;
            SAC_NUMBER.LostFocus += AddHintText;

        }

        // HERE WE ADD THE HINT TEXT TO THE TEXT_BOXES AT BEGINIG OF APP;
        private void SetHintText(TextBox textBox, string? hintText, int number)
        {

            if(string.IsNullOrEmpty(hintText) || string.IsNullOrWhiteSpace(hintText))
                textBox.Text = premadeData[number];
            else textBox.Text = hintText;

            textBox.Tag = premadeData[number];
            if (hintText == premadeData[number])
            {

                textBox.Foreground = new SolidColorBrush(Colors.Gray);

            } else {
             
                textBox.Foreground = new SolidColorBrush(Colors.Black);

            }

        }

        // HERE WE REMOVE THE HINT TEXT;
        private void RemoveHintText(object sender, RoutedEventArgs e)
        {

            TextBox? textBox = sender as TextBox;

            if (textBox != null)
            {

                if (textBox.Text == (string)textBox.Tag)
                {

                    textBox.Text = "";
                    textBox.Foreground = new SolidColorBrush(Colors.Black);

                }

            }

        }

        // HERE WE ADD BACK THE HINT TEXT;
        private void AddHintText(object sender, RoutedEventArgs e)
        {

            TextBox? textBox = sender as TextBox;

            if (textBox != null)
            {

                if (string.IsNullOrWhiteSpace(textBox.Text))
                {

                    textBox.Text = (string)textBox.Tag;
                    textBox.Foreground = new SolidColorBrush(Colors.Gray);

                }

            }

        }

        // DETERMINE WHEN IN FOCUS OR NOT;
        private void FocusableArea_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

            // SO THAT TEXT HINTS APPEAR AGAIN;
            (sender as UIElement)?.Focus();

        }

        private void SaveData(string message, bool flag)
        {

            DatabaseHandler2 db = new DatabaseHandler2();

            if (flag) { 
            
                int x = 10000;
                int y = 0;

                if(SAC_ALLOWED.IsChecked == true) {

                    y = 1;

                }

                if (Int32.Parse(SAC_NUMBER.Text) != x) {

                    db.updateData(Int32.Parse(SAC_NUMBER.Text), y, EMAIL.Text);

                } else {

                    db.updateData(x, y, EMAIL.Text);

                }

                MessageBox.Show(message);

            } else {

                db.updateData(0, 0 , null);
                MessageBox.Show(message);

            }

        }

        private void Save_Settings(object sender, RoutedEventArgs e)
        {
            
            SaveData("All input has been saved.", true);

        }

        private void Restore_Default(object sender, RoutedEventArgs e) 
        {

            SaveData("All options have been restored to default.", false);
        
        }

        private void ToggleSwitch_Checked(object sender, RoutedEventArgs e) 
        {
            
            SAC_TEXT.Foreground = new SolidColorBrush(Colors.White);
            SAC_NUMBER.Foreground = new SolidColorBrush(Colors.Black);
            SAC_NUMBER.Background = new SolidColorBrush(Colors.White);
            SAC_NUMBER.BorderBrush = new SolidColorBrush(Colors.White);
            SAC_NUMBER.IsEnabled = true;
            AddHintText(SAC_NUMBER, e);

        }

        private void ToggleSwitch_Unchecked(object sender, RoutedEventArgs e) // color fixing
        {

            SAC_TEXT.Foreground = new SolidColorBrush(Colors.Black);
            SAC_NUMBER.Foreground = new SolidColorBrush(Colors.Black);
            SAC_NUMBER.Background = new SolidColorBrush(Colors.Black);
            SAC_NUMBER.BorderBrush = new SolidColorBrush(Colors.Black);
            SAC_NUMBER.IsEnabled = false;

        }

    }

    public class DatabaseHandler2
    {

        private const string ConnectionString = "Data Source=my_own_space_server_code/admin_db.sqlite;Version=3;";

        public DatabaseHandler2()
        {

            InitializeDatabase();

        }

        private void InitializeDatabase()
        {

            using (var connection = new SQLiteConnection(ConnectionString))
            {

                connection.Open();

                string createTableQuery = @"CREATE TABLE IF NOT EXISTS admin_table (

                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            MAX_CONN_DAY INT NOT NULL DEFAULT 0 ,
                                            KEY VARCHAR(250) NULL,
                                            ALLOW_SHUTDOWN INT NOT NULL DEFAULT 0 ,
                                            EMAIL VARCHAR(250) NULL

                );";

                using (var command = new SQLiteCommand(createTableQuery, connection))
                {

                    command.ExecuteNonQuery();

                }

            }

        }


        public void updateData(int max_conn, int allow_shutdown, string? email)
        {

            using (var connection = new SQLiteConnection(ConnectionString))
            {

                connection.Open();
                string insertQuery = "UPDATE admin_table SET MAX_CONN_DAY = @mcd , ALLOW_SHUTDOWN = @as , EMAIL = @e WHERE id = 1";

                using (var command = new SQLiteCommand(insertQuery, connection))
                {

                    command.Parameters.AddWithValue("@mcd", max_conn);
                    command.Parameters.AddWithValue("@as", allow_shutdown);
                    command.Parameters.AddWithValue("@e", email);

                    command.ExecuteNonQuery();
                }

            }

        }


        public string?[] ReadData()
        {

            string?[] readArray = { null, null, null };

            using (var connection = new SQLiteConnection(ConnectionString))
            {

                connection.Open();
                string selectQuery = "SELECT MAX_CONN_DAY , ALLOW_SHUTDOWN , EMAIL FROM admin_table WHERE Id = 1";

                try
                {

                    using (var command = new SQLiteCommand(selectQuery, connection))
                    {

                        using (var reader = command.ExecuteReader())
                        {

                            if (reader.Read())
                            {

                                readArray[0] = reader["MAX_CONN_DAY"].ToString();
                                readArray[1] = reader["ALLOW_SHUTDOWN"].ToString();
                                readArray[2] = reader["EMAIL"].ToString();
                               
                                return readArray;

                            }
                            else
                            {

                                return readArray;

                            }

                        }

                    }

                }
                catch
                {

                    MessageBox.Show("Error reatriving stored info from databse, try running application as administrator.");

                    return readArray;

                }

            }

        }

    }

}


