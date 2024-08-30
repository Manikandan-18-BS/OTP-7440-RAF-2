/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/url'],
/**
 * @param{currentRecord} currentRecord
 * @param{url} url
 */
function(currentRecord, url) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {

        window.onbeforeunload = null;
    }

    /**
     * Function to be executed when the Get Weather Button is clicked
     */
    function getWeatherData(){
        try{
            let record = currentRecord.get();

            let location = record.getValue('custpage_location');
            let date = record.getValue('custpage_date');
            console.log(date)

                document.location = url.resolveScript({
                    deploymentId: 'customdeploy_jj_sl_weather_data',
                    scriptId: 'customscript_jj_sl_weather_data',
                    params: {
                        loc : location || '',
                        dat: date ||''
                    }
                });
        }
        catch(e){
            console.error('Error Found',e.message);
        };
    }

     /**
     * Function to be executed when the Download Button is clicked
     */
    function downloadCSV(){
        try{
            let record = currentRecord.get();

            let lineCount = record.getLineCount({
                sublistId: 'custpage_sublist'
            });

            log.debug('Line count:',lineCount);
            let csvContent = 'Date Time ,Date Time Epoch ,Temperature ,Feels like ,Humidity ,Dew ,Precip ,Precipprob ,Snow ,Snow Dept ,Precip Type ,Wind Gust\n'

            for(let i = 0 ; i < lineCount; i++){

                let datetime = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_datetime',
                    line: i
                });
                
                let datetimeepoch = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_datetimeepoch',
                    line: i
                });

                let temp = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_temp',
                    line: i
                });

                let feelslike = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_feelslike',
                    line: i
                });

                let humidity = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_humidity',
                    line: i
                });

                let dew = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_dew',
                    line: i
                });

                let precip = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_precip',
                    line: i
                });

                let precipprob = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_precipprob',
                    line: i
                });

                let snow = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_snow',
                    line: i
                });

                let snowdepth = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_snowdepth',
                    line: i
                });

                let preciptype = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_preciptype',
                    line: i
                });

                let windgust = record.getSublistValue({
                    sublistId: 'custpage_sublist',
                    fieldId: 'custpage_windgust',
                    line: i
                });

            }
        }
        catch(e){
            console.error('Error Found',e.message);
        };
    }

    return {
        pageInit: pageInit,
        getWeatherData:getWeatherData,
        downloadCSV:downloadCSV
    };
    
});
