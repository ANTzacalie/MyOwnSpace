   M S B A M L   `   `   `  ���� I  EStartInterface, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null/clr-namespace:StartInterfaceStartInterface      StartInterface.MainWindow   W SPresentationCore, Version=8.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\ XPresentationFramework, Version=8.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35e aSystem.Windows.Controls.Ribbon, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089R NWindowsBase, Version=8.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35F 9http://schemas.microsoft.com/winfx/2006/xaml/presentation     R NSystem.Xaml, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     @d2http://schemas.microsoft.com/expression/blend/2008     Jmc;http://schemas.openxmlformats.org/markup-compatibility/2006     .localclr-namespace:StartInterface     -     �Name$  
MainScreen�� � Title$% GAMMA SERVER ver1.3 , dev M.C.A��$	��720��$
��1200��
���   ����	#FF020101 � Icon$/ )pack://application:,,,/resources/icon.ico��.��� -   $��INTERFACE_GRID��.+��� -   
������ $
|�True��._��� $
��Wrap=�$��55(�$
��Left=�
�������$��Γ��$��30,15,0,616q��� -    ��Name$ buttonStart��$��START��$��300,550,0,0q����	#FF2BF70F
�������$��16(�$
��Left=�$	��100��$��54��$	��Top=� �� 	ClickMode$ Press=��� -   $ 
buttonStop��$
��STOP��$��800,550,0,0q����	#FFF50808$��16(����	#FFFBFAFA$
��Left=�$	��100��$��54��$	��Top=�$ Press=��� $��
100,64,0,0q�$
��Wrap=�$��20(�$#��PRIVATE KEY PATH(privkey.pem)��$��27��$	��Top=�$
��Left=�$	��281��
��������� $��100,124,0,0q�$
��Wrap=�$ ��CERTIFICATE PATH(cert.pem)��$��20(�$
��Left=�$	��250��$��27��$	��Top=�
��������� $��100,184,0,0q�$
��Wrap=�$��20(�$��CHAIN PATH(chain.pem)��$
��Left=�$	��220��$��27��$	��Top=�
��������� $��
700,64,0,0q�$
��Wrap=�$��EMAIL FOR NODEMAILER��$��20(�$
��Left=�$	��250��$��27��$	��Top=�
��������� $��700,124,0,0q�$
��Wrap=�$��PASSWORD FOR THE EMAIL��$��20(�$
��Left=�$	��300��$��27��$	��Top=�
��������� $��700,184,0,0q�$
��Wrap=�$��HOSTNAME��$	��Top=�$��20(�$
��Left=�$	��120��
��������� $��700,244,0,0q�$
��Wrap=�$
��PORT��$��20(�$
��Left=�$��60��$��27��$	��Top=�
��������� -    ��Name$ PRIVATE_KEY_PATH��$��
100,94,0,0q� �� TextWrapping$
 Wrap=�$
��PATH��$��14(�
�������$
��Left=�$	��400��$��21��$	��Top=��� -   $ CERTIFICATE_PATH��$��100,154,0,0q�$
 Wrap=�$
��PATH��$��14(�$
��Left=�$	��400��$��22��$	��Top=��� -   $ 
CHAIN_PATH��$��100,214,0,0q�$
 Wrap=�$
��PATH��$��14(�$
��Left=�$	��400��$��21��$	��Top=��� -	   $ EMAIL��$��
700,94,0,0q�$
 Wrap=�$��example@gmail.com��$��14(�$
��Left=�$	��400��$��21��$	��Top=��� -
   $ EMAIL_PASSWORD��$��700,154,0,0q�$
 Wrap=�$D��>Its should be a specific password generated for email sending!��$��14(�$
��Left=�$	��400��$��21��$	��Top=��� -   $ SERVER_HOSTNAME��$��700,214,0,0q�$
 Wrap=�$��14(�$A��;IPV4 adress , as set on router virtual server(port-forward)��$
��Left=�$	��400��$��21��$	��Top=��� -   $ SERVER_PORT��$��700,274,0,0q�$
 Wrap=�$��14(�$1��+Port number set on virtual server(ex: 8080)��$
��Left=�$	��400��$��21��$	��Top=��� -    ��Name$ LOGS_CHECKBOX��$3��-CLICK HERE IF YOU WANT TO SEE ALL SERVER LOGS��$��100,504,0,0q�$ Press=�$
��Left=�$	��400��$��15��$	��Top=�
��������� -   $ 
SAVE_INPUT��$
��SAVE��$��1090,15,0,0q� J� RenderTransformOrigin$ 0.934,0.703&����	#FF192DD8
�������$��44��$	��Top=�$
��Left=�$��85��