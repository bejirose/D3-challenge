Attribute VB_Name = "Module1"
Sub stockAnalysis()

    'Declaring the variables
    Dim openingPrice As Double
    Dim closingPrice As Double
    Dim totalVolume As LongLong
    Dim percentChange As Variant
    Dim priceChange As Double
    Dim tableRowCount As Integer
    Dim greatestTicker(3) As String
    Dim greatestVolume As Double
    Dim greatestIncrease As Double
    Dim greatestDecrease As Double
        
    Dim rowCount As Long
    
    'loop through the worksheet
    For Each ws In Worksheets
        'initialize the variables
        greatestVolume = 0
        greatestIncrease = 0
        greatestDecrease = 0
        
       'write the table headings
        ws.Cells(1, 9).Value = "Ticker"
        ws.Cells(1, 10).Value = "Yearly Change"
        ws.Cells(1, 11).Value = "Percent Change"
        ws.Cells(1, 12).Value = "Total Stock Volume"
               
        ' get the record count of each sheet
        rowCount = ws.Cells(Rows.Count, 1).End(xlUp).Row
        
        openingPrice = ws.Cells(2, 3).Value ' save the opening price first
        tableRowCount = 2 'starting the record from the second row, first row has the headings
        
        'Loop through each record in the current sheet
        For i = 2 To rowCount
            ' check if tickers are same or different
            If (ws.Cells(i, 1) <> ws.Cells(i + 1, 1)) Then ' save the closing price
                closingPrice = ws.Cells(i, 6).Value
                totalVolume = totalVolume + ws.Cells(i, 7).Value 'write the last volume
                                 
                ' check for zero to avoid run time error
                priceChange = closingPrice - openingPrice
                If ((openingPrice = 0) Or (priceChange = 0)) Then
                   percentChange = 0
                Else
                   percentChange = priceChange / openingPrice
                End If
                
                'write the data to the table
                ws.Cells(tableRowCount, 9).Value = ws.Cells(i, 1).Value  'write ticker
                ws.Cells(tableRowCount, 10).Value = priceChange 'write yearly change
                ws.Cells(tableRowCount, 11).Value = Format(percentChange, "Percent") 'write percent Change
                ws.Cells(tableRowCount, 12).Value = totalVolume 'write total volume
                
                ' Do conditional formatting
                If (priceChange > 0) Then
                   ws.Cells(tableRowCount, 10).Interior.ColorIndex = 4 ' color green
                Else
                    ws.Cells(tableRowCount, 10).Interior.ColorIndex = 3 ' color red
                End If
                
                ' check greatest values
                If (percentChange > greatestIncrease) Then  ' greatest increase
                    greatestTicker(1) = ws.Cells(i, 1).Value 'store the greatest Increase ticker
                    greatestIncrease = percentChange
                End If
                If (percentChange < greatestDecrease) Then 'greatest decrease
                    greatestTicker(2) = ws.Cells(i, 1).Value 'store the greatest Decrease ticker
                    greatestDecrease = percentChange
                End If
                
                If (totalVolume > greatestVolume) Then
                    greatestTicker(3) = ws.Cells(i, 1).Value 'store the greatest Volume ticker
                    greatestVolume = totalVolume
                End If
                                
                ' Reset values
                totalVolume = 0
                closingPrice = 0
                tableRowCount = tableRowCount + 1 ' increment the rowcount to write the next ticker totals
                openingPrice = ws.Cells(i + 1, 3).Value ' save the opening price for the next ticker
               
                             
            Else
                totalVolume = totalVolume + Cells(i, 7).Value
            End If
        Next i
        
        ' Write the Greatest Value Table
        ws.Cells(1, 15).Value = "Ticker"
        ws.Cells(1, 16).Value = "Value"
        
        'write greatest increase values
        ws.Cells(2, 14).Value = "Greatest % Increase"
        ws.Cells(2, 15).Value = greatestTicker(1)
        ws.Cells(2, 16).Value = Format(greatestIncrease, "Percent")
                
        'write greatest decrease values
        ws.Cells(3, 14).Value = "Greatest % Decrease"
        ws.Cells(3, 15).Value = greatestTicker(2)
        ws.Cells(3, 16).Value = Format(greatestDecrease, "Percent")
        
        'write greatest volume values
        ws.Cells(4, 14).Value = "Greatest Total Volume"
        ws.Cells(4, 15).Value = greatestTicker(3)
        ws.Cells(4, 16).Value = greatestVolume
        
        Next ws
End Sub
