/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
/***************************************************************************************
 * *****************
 * RAF Task
 * 
 * OTP-7440:Close_sale_order
 * 
 * 
 * *************************************************************************************
 * ******************
 * 
 * Author: Jobin and Jismi IT Services LLP
 * 
 * Date Created: 30-August-2024
 * 
 * Description: Close all sales orders with a status of "Pending Fulfillment" that were created on or before 30 days ago. Develop a scheduled script that runs once a day to perform this task. After the script execution, generate a CSV report containing the details of the closed sales orders. The CSV must include the document number, internal ID, customer name, and total amount.
 * 
 * REVISION HISTORY
 * 
 * @version 1.0 OTP-7440:30-August-2024: Created the initial build by JJ0327
 * 
 * 
 * ***************************************************************************************
 *******************/
define(['N/email', 'N/file', 'N/record', 'N/search'],
    /**
 * @param{email} email
 * @param{file} file
 * @param{record} record
 * @param{search} search
 */
    ( email, file, record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try{

                let srch = search.create({
                    type: search.Type.SALES_ORDER,
                    filters:[["mainline","is","T"],  
                    "AND", 
                    ["trandate","onorbefore","thirtydaysago"], 
                    "AND", 
                    ["status","anyof","SalesOrd:B"]],
                    columns:['tranid','internalid','entity','amount']
                });

                let csvContent = 'Document Number, Internal ID, Customer Name,Total Amount\n';
                let recId ='';

                srch.run().each(function(result){

                    recId = result.getValue('internalid');
                    let docNum = result.getValue('tranid');
                    let cusName = result.getText('entity');
                    let tot = result.getValue('amount');

                    csvContent+= docNum+','+recId+','+cusName+','+tot+'\n';

                    let recLoad = record.load({
                        type: record.Type.SALES_ORDER,
                        id: recId,
                        isDynamic: true
                    });

                    let lineCount = recLoad.getLineCount({
                        sublistId: 'item'
                    });

                    for(let i=0 ;i < lineCount; i++){

                        recLoad.selectLine({
                            sublistId: 'item',
                            line: i
                        });

                        recLoad.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'isclosed',
                            value: true
                        });

                        recLoad.commitLine({
                            sublistId: 'item',
                        });
                    };

                    let recSave = recLoad.save({
                        enableSourcing: true,
                        ignoreMandatotryFields: true
                    });

                    return true;
                });

                if(recId){

                    log.debug('CSV Content:',csvContent);

                    let csvFile = file.create({
                        name: 'Closed Sales Order Details',
                        fileType: file.Type.CSV,
                        contents: csvContent,
                        folder: -15,
                    });

                    let csvSave = csvFile.save();

                    let emailBody = '<p>We hope this email finds you well.</p>' +
                                        '<p>Please check the attached file</p>' +
                                        '<p>Best Regards,</p>';

                    if(csvSave){
                        email.send({
                            author: -5,
                            body: '<p>Hai <strong>Manikandan</strong></p>'+emailBody+'<p>Larry Nelson</p>',
                            recipients: 'manikandan.balaguru@jobinandjismi.com',
                            subject: 'Closed Sales Order Details',
                            attachments: [file.load({
                                id: csvSave
                            })]
                        });
                        log.debug('Email Send')
                    };
                };
            }
            catch(e){
                log.error('Error Found:',e.message);
                log.error('Error Found:',e.stack);

            }

        }

        return {execute}

    });
