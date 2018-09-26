I hope you and Maher are both well.

 

As a simple and initial test, I would like your team to create a small media player style application that will access folders over a network or an inserted USB key and display a list of compatible files in say a left hand pane, there could be a small filter button to show images/video/both.  The files are only going to be .jpg and .avi (dIVX Codec) so any other files should not be displayed in this pane.

 

The application should be designed to be used by non-technical users and should be very intuitive and easy to use.

 

To start you off you can get a small Visual Studio project easily online (DSPlyer.exe plus source code) which is based on .NET and has the basic MS Windows filter graph / direct X display source code to allow you to open an AVI file and render it to a floating Window.  You may need to install FFDSHOW on your pc if you use this test program.

 

So initially as a test the app should be MS Windows 7/10 based, but later we may find a client that requires a tablet or  iOS version, but this is not important right now.

 

Objectives:

The end result I am looking for is a very simple to use media player with large buttons suitable for touch screen use, ( small media player buttons are not sufficient)  Also, it should be aimed at users not familiar with Windows. There should also be the following elements / considerations and this could be achieved in stages.

 

1.            Application should be with a single Image window, controls all in a single document interface, no pop up image windows, 90% of the time it will be run full screen on laptops with ~1280x800 resolution or Higher.

2.            Play/Pause/Stop buttons, if possible speed +/- control (media player classic has speed control) and a time line / bar which can also be used to advance the video, with a start/end/current time and play speed (e.g. x1  x2 x 0.5  x0.25 etc) all being displayed.

3.            Browse button which shows default folders in either the previously used path or which could be saved in an .ini file as for example [Default_Path] Path=D:/Case Management/Active Cases/Case_12345/  Ideally when the browse button is pressed, only folders in that location are shown, not the default Windows folders / Network / all drives etc which could be confusing for the user.

4.            Play list display initially just file names and perhaps later thumbnails. The play list should have 2 buttons or tick boxes to show only jpgs/only avis/ or both avi and jpgs in the selected folder. The play list should be able to display at least say 10-15 files but may also need scroll bars or similar to allow any remaining files in that folder to be displayed.

5.            A Play All check box or button, to play all files shown in the playlist, a small clock icon could be used to alter the default say 5-second delay for displaying a jpg. While playing, a stop will stay on the current image / video and not revert to the start of the list.

6.            The application should be re-sizeable to full screen.

7.            Aspect Ratio, this is important, there are 2 types of files typically, 4:3 and Wide Screen/HD, so the rendered image in the Display Window should retain aspect.

a.            Full frame files, these are the majority and the application if resized for example on a wide-screen display, the aspect should be retained and the image window padded or the image centralised and aspect retained (like media player does).

b.            Half frame (field) files, these are very rare but may occurs, we would need either to detect this aspect ratio mathematically and automatically double scale vertically to create the full frame or have a button (we use this method in ViewSTATION), because sometimes users can capture a non-standard ROI and save it, then the aspect is correct, but the image size may be misleading.

8.            Audio: either MUTE or volume +/- buttons could be useful.

9.            Program name: “VideoSAFE Viewer”

 

For the final release of this program, there is a requirement for playing encrypted files and making the application / case folders pass-word protected, but this security can be added once the program is working well, and it is likely this could be your first main project if you create a successful player.

 

Operation description:

After launch, I would suggest a dialog (titled: “Select Case”) is displayed immediately with the default case folders displayed and a browse button, so the user only has to select his case folder and press OK. If cancel is pressed, the application would remain but only the browse button would be active. To begin with, the standard Windows OPEN dlg should be OK, as many users are familiar with this, later we could improve the case folder selection.

 

Whenever a new folder (which is our active case) is selected, the play list is populated with ALL files compatible files in that folder, if other files are present they wou