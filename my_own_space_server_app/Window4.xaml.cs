using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using static DatabaseHandler;

namespace StartInterface
{
    
    public partial class Window4 : Window
    {

        public ObservableCollection<UserItem> Users { get; set; }
        DatabaseHandler db = new DatabaseHandler();

        public Window4()
        {
            InitializeComponent();

            
            SetHintText(EmailTextBox, "Email"); EmailTextBox.Tag = "Email";
            SetHintText(PasswordBox, "Password"); PasswordBox.Tag = "Password";

            // HINT TEXT ADD/REMOVE BASED ON FOCUS;
            EmailTextBox.GotFocus += RemoveHintText;
            EmailTextBox.LostFocus += AddHintText;
            PasswordBox.GotFocus += RemoveHintText;
            PasswordBox.LostFocus += AddHintText;

            Users = new ObservableCollection<UserItem>();

            List<UserInfo>? list = db.ReadUsers();
            if (list != null)
            {

                foreach (UserInfo? i in list)
                {
                    Users.Add(new UserItem { Name = i.Email });
                }

            }
            UsersListBox.ItemsSource = Users;  // Bind the ListBox

        }

        private void Add_user(object sender, RoutedEventArgs e)
        {
            string name = EmailTextBox.Text;
            string password = PasswordBox.Text;

            var ok = true;

            if (name != string.Empty && password != string.Empty && name != "Email" && password != "Password")
            {
                foreach (UserItem? i in Users)
                {

                    if (i.Name == name)
                    {
                        ok = false; break;
                    }

                }

                if (ok) {

                    db.AddUser(name, password);
                    Users.Add(new UserItem { Name = name });
                    UsersListBox.ItemsSource = Users; // bind again

                } else {

                    MessageBox.Show("User already exists!");

                }

            }

        }

        private void DeleteUser_Click(object sender, RoutedEventArgs e)
        {

            if (sender is Button btn && btn.CommandParameter is UserItem user)
            {

                db.RemoveUser(user.Name);
                Users.Remove(user);

            }

        }


        private void SetHintText(TextBox textBox, string? hintText)
        {

            textBox.Text = hintText;

            if (hintText == "Email" || hintText == "Password")
            {

                textBox.Foreground = new SolidColorBrush(Colors.Gray);

            }
            else
            {

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

        private void FocusableArea_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {

            // SO THAT TEXT HINTS APPEAR AGAIN;
            (sender as UIElement)?.Focus();

        }

        public class UserItem
        {

            public required string? Name { get; set; }

        }

    }

}



