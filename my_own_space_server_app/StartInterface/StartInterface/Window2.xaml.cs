using System.Diagnostics;
using System.IO;
using System.Windows;


namespace StartInterface
{

    public partial class Window2 : Window
    {

        public Window2()
        {

            InitializeComponent();

            string mdText = File.ReadAllText("LICENSE.md");
            SecondT.Text = mdText;

        }

        private void Open_source_licenses(object sender, RoutedEventArgs e)
        {

            Window3 newWindow = new Window3();
            newWindow.ShowDialog();

        }

        private void ToGithub(object sender, RoutedEventArgs e) 
        {

            try {

                Process.Start(new ProcessStartInfo
                {

                    FileName = "https://github.com/ANTzacalie/MyOwnSpace",  
                    UseShellExecute = true

                });

            }
            catch (Exception ex)
            {

                MessageBox.Show($"Could not open link: {ex.Message}");

            }

        }

    }

}
