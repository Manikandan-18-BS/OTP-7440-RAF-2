/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/file', 'N/format', 'N/https', 'N/keyControl', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{file} file
 * @param{format} format
 * @param{https} https
 * @param{keyControl} keyControl
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (file, format, https, keyControl, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try{
                if(scriptContext.request.method === 'GET'){
                    let form = serverWidget.createForm({
                        title: 'Weather Data'
                    });

                    form.clientScriptFileId = 4517;

                    let loc =form.addField({
                        id: 'custpage_location',
                        label: 'Location',
                        type: serverWidget.FieldType.TEXT
                    });
                    loc.isMandatory = true;

                    let date =form.addField({
                        id: 'custpage_date',
                        label: 'Date',
                        type: serverWidget.FieldType.DATE
                    }).isMandatory = true;

                    let subList = form.addSublist({
                        id: 'custpage_sublist',
                        label: 'Details',
                        type: serverWidget.SublistType.LIST
                    });

                    subList.addField({
                        id:'custpage_datetime',
                        label:'Date Time',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_datetimeepoch',
                        label:'Date Time Epoch',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_temp',
                        label:'Temperature',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_feelslike',
                        label:'Feels like',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_humidity',
                        label:'Humidity',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_dew',
                        label:'Dew',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_precip',
                        label:'Precip',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_precipprob',
                        label:'Precipprob',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_snow',
                        label:'Snow',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_snowdepth',
                        label:'Snow Dept',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_preciptype',
                        label:'Precip Type',
                        type: serverWidget.FieldType.TEXT
                    });

                    subList.addField({
                        id:'custpage_windgust',
                        label:'Wind Gust',
                        type: serverWidget.FieldType.TEXT
                    });

                    let getLocation = scriptContext.request.parameters.loc || '';
                    let getDate = scriptContext.request.parameters.dat ||'';

                    let dateValue = new Date(getDate);
                    let tDate = dateValue.getDate();
                    let month = dateValue.getMonth()+1;
                    let year = dateValue.getFullYear();
                    let givenDate = year+'-'+month+'-'+tDate;

                    let today = new Date;
                    let toDate = today.getDate();
                    let tomonth = today.getMonth()+1;
                    let toyear = today.getFullYear();
                    let currentDate = toyear+'-'+tomonth+'-'+toDate;

                    loc.defaultValue = getLocation;
                    date.defaultValue = getDate;

                    
                    if(getLocation){

                        let url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'+getLocation+'/'+givenDate+'/'+currentDate+'?key=58VYPRJGXK5UBANBWSU7G2KGA';

                        // let url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london/2024-08-29/2024-09-29?key=2PXRCRJNET2A9NUAMF6TN7ENB';
                        log.debug('Url:',url);
                        let apiResponse = https.get({
                            url: url,
                        });

                        let weatherData = JSON.parse(apiResponse.body);
                        log.debug('Data:',weatherData.days);
                        let linecount = weatherData.days

                        for(let i = 0 ; i< linecount.length ; i++){

                            let weath = weatherData.days[i];

                            subList.setSublistValue({
                                id: 'custpage_datetime',
                                line: i,
                                value: weath['datetime']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_datetimeepoch',
                                line: i,
                                value: weath['datetimeEpoch']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_temp',
                                line: i,
                                value: weath['temp']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_feelslike',
                                line: i,
                                value: weath['feelslike']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_humidity',
                                line: i,
                                value: weath['humidity']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_dew',
                                line: i,
                                value: weath['dew']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_precip',
                                line: i,
                                value: weath['precip']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_precipprob',
                                line: i,
                                value: weath['precipprob']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_snow',
                                line: i,
                                value: weath['snow']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_snowdepth',
                                line: i,
                                value: weath['snowdepth']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_preciptype',
                                line: i,
                                value: weath['preciptype']|| null
                            });

                            subList.setSublistValue({
                                id: 'custpage_windgust',
                                line: i,
                                value: weath['windgust']|| null
                            });
                        };
                    };

                    form.addButton({
                        id: 'custpage_weather_data',
                        label: 'Get Weather Data',
                        functionName: 'getWeatherData'
                    });

                    form.addButton({
                        id: 'custpage_download',
                        label: 'Download CSV',
                        functionName: 'downloadCSV'
                    });

                    scriptContext.response.writePage(form);
                }
            }
            catch(e){
                log.error('Error Found:',e.message);
            }

        }

        return {onRequest}

    });
