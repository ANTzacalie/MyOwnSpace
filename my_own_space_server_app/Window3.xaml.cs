using System.IO;
using System.Windows;


namespace StartInterface
{
   
    public partial class Window3 : Window
    {
        public Window3()
        {
            InitializeComponent();

            string mdText = File.ReadAllText("Licenses.txt");
            SecondT.Text = mdText;

        }

    }

}
