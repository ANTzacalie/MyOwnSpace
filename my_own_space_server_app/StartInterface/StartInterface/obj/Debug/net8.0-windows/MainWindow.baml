   M S B A M L   `   `   `  ����I  EStartInterface, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null/clr-namespace:StartInterfaceStartInterface  5   	       StartInterface.MainWindow   5   	   W SPresentationCore, Version=8.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35\ XPresentationFramework, Version=8.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35e aSystem.Windows.Controls.Ribbon, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089R NWindowsBase, Version=8.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35F 9http://schemas.microsoft.com/winfx/2006/xaml/presentation     5   	   R NSystem.Xaml, Version=8.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5   	   @d2http://schemas.microsoft.com/expression/blend/2008     5   	   Jmc;http://schemas.openxmlformats.org/markup-compatibility/2006     5   	   .localclr-namespace:StartInterface     5   	   -   5          �Name$  
MainScreen��5   	    � Title$% GAMMA SERVER ver1.3 , dev M.C.A��5   	   $	��720��61   $
��1200��6>   
���   ����	#FF020101 � Icon$/ )pack://application:,,,/resources/icon.ico��5	   	   .��5      � -   5        $��INTERFACE_GRID��5      .+�5   
   �� -   5        
������ $
|�True��5   *   ._�5      �� $
��Wrap=�6   $��35(�6,   $
��Left=�6:   
�������$��
MyOwnSpace��6h   $��30,15,0,616q�6z   5      �� 5   
   -   5         ��Name$ buttonStart��5      $��START��6&   $��300,550,0,0q�66   ���	#FF2BF70F
�������$��16(�6u   $
��Left=�6�   $	��100��6�   $��54��6�   $	��Top=�6�    �� 	ClickMode$ Press=�6�   6�   �� 5   
   -   5        $ 
buttonStop��5      $
��STOP��6%   $��800,550,0,0q�64   ���	#FFF50808$��16(�6`   ���	#FFFBFAFA$
��Left=�6�   $	��100��6�   $��54��6�   $	��Top=�6�   $ Press=�6�   6�   �� 5   
   $��100,124,0,0q�6   $
��Wrap=�6)   $��20(�6=   $#��PRIVATE KEY PATH(privkey.pem)��6K   $��27��6p   $	��Top=�6|   $
��Left=�6�   $	��281��6�   
�������6�   �� 5   
   $��100,184,0,0q�6   $
��Wrap=�6)   $ ��CERTIFICATE PATH(cert.pem)��6=   $��20(�6_   $
��Left=�6m   $	��250��6�   $��27��6�   $	��Top=�6�   
�������6�   �� 5   
   $��100,244,0,0q�6   $
��Wrap=�6)   $��20(�6=   $��CHAIN PATH(chain.pem)��6K   $
��Left=�6h   $	��220��6�   $��27��6�   $	��Top=�6�   
�������6�   �� 5   
   $��700,124,0,0q�6   $
��Wrap=�6)   $��EMAIL FOR NODEMAILER��6=   $��20(�6Y   $
��Left=�6g   $	��250��6�   $��27��6�   $	��Top=�6�   
�������6�   �� 5   
   $��700,184,0,0q�6   $
��Wrap=�6)   $��PASSWORD FOR THE EMAIL��6=   $��20(�6[   $
��Left=�6i   $	��300��6�   $��27��6�   $	��Top=�6�   
�������6�   �� 5   
   $��700,244,0,0q�6   $
��Wrap=�6)   $��HOSTNAME��6=   $	��Top=�6M   $��20(�6e   $
��Left=�6s   $	��120��6�   
�������6�   �� 5!   
   $��700,304,0,0q�6   $
��Wrap=�6)   $
��PORT��6=   $��20(�6I   $
��Left=�6W   $��60��6r   $��27��6}   $	��Top=�6�   
�������6�   �� 5#   
   -   5         ��Name$ PRIVATE_KEY_PATH��5#      $��100,154,0,0q�6,    �� TextWrapping$
 Wrap=�6A   $
��PATH��6U   $��14(�6a   
�������$
��Left=�6�   $	��400��6�   $��21��6�   $	��Top=�6�   �� 5%   
   -   5        $ CERTIFICATE_PATH��5%      $��100,214,0,0q�6,   $
 Wrap=�6A   $
��PATH��6U   $��14(�6a   $
��Left=�6o   $	��400��6�   $��22��6�   $	��Top=�6�   �� 5'   
   -   5        $ 
CHAIN_PATH��5'      $��100,274,0,0q�6&   $
 Wrap=�6;   $
��PATH��6O   $��14(�6[   $
��Left=�6i   $	��400��6�   $��21��6�   $	��Top=�6�   �� 5)   
   -	   5        $ EMAIL��5)      $��700,154,0,0q�6!   $
 Wrap=�66   $��example@gmail.com��6J   $��14(�6c   $
��Left=�6q   $	��400��6�   $��21��6�   $	��Top=�6�   �� 5+   
   -
   5        $ EMAIL_PASSWORD��5+      $��700,214,0,0q�6*   $
 Wrap=�6?   $D��>Its should be a specific password generated for email sending!��6S   $��14(�6�   $
��Left=�6�   $	��400��6�   $��21��6�   $	��Top=�6�   �� 5-   
   -   5        $ SERVER_HOSTNAME��5-      $��700,274,0,0q�6+   $
 Wrap=�6@   $��14(�6T   $A��;IPV4 adress , as set on router virtual server(port-forward)��6b   $
��Left=�6�   $	��400��6�   $��21��6�   $	��Top=�6�   �� 5/   
   -   5        $ SERVER_PORT��5/      $��700,334,0,0q�6'   $
 Wrap=�6<   $��14(�6P   $1��+Port number set on virtual server(ex: 8080)��6^   $
��Left=�6�   $	��400��6�   $��21��6�   $	��Top=�6�   �� 51   
   -   5         ��Name$ LOGS_CHECKBOX��51      $3��-CLICK HERE IF YOU WANT TO SEE ALL SERVER LOGS��6*   $��100,504,0,0q�6b   $ Press=�6w   $
��Left=�6�   $	��400��6�   $��15��6�   $	��Top=�6�   
�������6�   �� 53   
   -   5        $ 
SAVE_INPUT��53      $
��SAVE��6%   $��1090,15,0,0q�64    J� RenderTransformOrigin$ 0.934,0.703&�6I   ���	#FF192DD8
�������$��44��6�   $	��Top=�6�   $
��Left=�6�   $��85��6�   55      57      