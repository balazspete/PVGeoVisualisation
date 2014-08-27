PVGeoVisualisation
==================

This web application is part of the dissertation, titled _Usable Mobile Geographical Linked Data Visualisation_ submitted to __Trinity College, University of Dublin__  for the degree of __M.Sc. in Computer Science (Mobile and Ubiquitous Computing)__.

This application visualises events of the [United States Political Violence Linked Data set](http://tcdfame.cs.tcd.ie/pv/) on a map. Users are capable to explore the data set using the map based visualisation. The application allows for the filtering of the visualised information through a visual query building interface that creates SPARQL queries that are run on the remote Linked Data store.

#Abstract of the dissertation

In this study, the usability of the visualisation of geographical Linked Data on a mobile device was investigated. A mobile application was developed through an iterative process where the development of later prototype iterations were guided by analysing the results of usability studies. After a paper-based study and three prototype iterations, this application was compared to a desktop-based Linked Data geographical visualisation. This work is important because the amount of available spatial Linked Data is growing every day and the need to visualise this information to help users understand it increases correspondingly. There has been less effort to date in mobile Linked Data research, and not many mobile applications focus on visualising geographical data.

The experiments showed that the usability of the mobile app was affected by the addition visual feedback, the increased number of features, the introduction of visual cues, and whether users preferred the mobile app over the desktop one. The results indicated that achieving equivalent usability to the desktop application on mobile is possible. These results show that both applications are suitable for the exploration of geographical Linked Data, however one application cannot fully replace the other as the suitability of an application ultimately depended on the user‚Äôs platform preferences.

The analysis of the results of the usability experiments enable readers to identify the main challenges to consider when designing a mobile Linked Data application. This is supported by the presented investigation of how different mobile and Linked Data visualisation challenges can apply to a tablet application. The findings of this study could help in making appropriate design decisions for future applications. However, it is important to note that the experiments have been carried out with a small number of participants and that more data would need to be gathered through user studies prior to making any final conclusions.


#Set up
You will require Node.js and npm. Run `npm install` from the project's root in order to install all dependencies. When complete, run `node server.js` to start up the server.

#How to
Go to http://localhost:8080. The application accesses the USPV data set through port 3030.

#License
Licensed under the MIT License. See LICENSE for more information.
