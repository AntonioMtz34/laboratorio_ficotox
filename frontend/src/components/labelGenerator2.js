//Formato para generar etiquetas de analisis de muestras de la impresora x 
export const generateLabelXml = (id) => {
    return `<?xml version="1.0" encoding="utf-8"?>
                                    <DesktopLabel Version="1">
                                    <DYMOLabel Version="3">
                                        <Description>DYMO Label</Description>
                                        <Orientation>Portrait</Orientation>
                                        <LabelName>Address1983173</LabelName>
                                        <InitialLength>0</InitialLength>
                                        <BorderStyle>SolidLine</BorderStyle>
                                        <DYMORect>
                                        <DYMOPoint>
                                            <X>0.03333335</X>
                                            <Y>0.23</Y>
                                        </DYMOPoint>
                                        <Size>
                                            <Width>0.9966667</Width>
                                            <Height>3.21</Height>
                                        </Size>
                                        </DYMORect>
                                        <BorderColor>
                                        <SolidColorBrush>
                                            <Color A="1" R="0" G="0" B="0"></Color>
                                        </SolidColorBrush>
                                        </BorderColor>
                                        <BorderThickness>1</BorderThickness>
                                        <Show_Border>False</Show_Border>
                                        <DynamicLayoutManager>
                                        <RotationBehavior>ClearObjects</RotationBehavior>
                                        <LabelObjects>
                                            <BarcodeObject>
                                            <Name>IBarcodeObject3</Name>
                                            <Brushes>
                                                <BackgroundBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="1" G="1" B="1"></Color>
                                                </SolidColorBrush>
                                                </BackgroundBrush>
                                                <BorderBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </BorderBrush>
                                                <StrokeBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </StrokeBrush>
                                                <FillBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </FillBrush>
                                            </Brushes>
                                            <Rotation>Rotation90</Rotation>
                                            <OutlineThickness>1</OutlineThickness>
                                            <IsOutlined>False</IsOutlined>
                                            <BorderStyle>SolidLine</BorderStyle>
                                            <Margin>
                                                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
                                            </Margin>
                                            <BarcodeFormat>Code128A</BarcodeFormat>
                                            <Data>
                                                <MultiDataString>
                                                <DataString>${id}</DataString>
                                                </MultiDataString>
                                            </Data>
                                            <HorizontalAlignment>Center</HorizontalAlignment>
                                            <VerticalAlignment>Middle</VerticalAlignment>
                                            <Size>Small</Size>
                                            <TextPosition>Bottom</TextPosition>
                                            <FontInfo>
                                                <FontName>Arial</FontName>
                                                <FontSize>8</FontSize>
                                                <IsBold>False</IsBold>
                                                <IsItalic>False</IsItalic>
                                                <IsUnderline>False</IsUnderline>
                                                <FontBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </FontBrush>
                                            </FontInfo>
                                            <ObjectLayout>
                                                <DYMOPoint>
                                                <X>0.596029</X>
                                                <Y>1.878384</Y>
                                                </DYMOPoint>
                                                <Size>
                                                <Width>0.4339712</Width>
                                                <Height>1.559732</Height>
                                                </Size>
                                            </ObjectLayout>
                                            </BarcodeObject>
                                            <BarcodeObject>
                                            <Name>IBarcodeObject34</Name>
                                            <Brushes>
                                                <BackgroundBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="1" G="1" B="1"></Color>
                                                </SolidColorBrush>
                                                </BackgroundBrush>
                                                <BorderBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </BorderBrush>
                                                <StrokeBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </StrokeBrush>
                                                <FillBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </FillBrush>
                                            </Brushes>
                                            <Rotation>Rotation90</Rotation>
                                            <OutlineThickness>1</OutlineThickness>
                                            <IsOutlined>False</IsOutlined>
                                            <BorderStyle>SolidLine</BorderStyle>
                                            <Margin>
                                                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
                                            </Margin>
                                            <BarcodeFormat>Code128A</BarcodeFormat>
                                            <Data>
                                                <MultiDataString>
                                                <DataString>${id}</DataString>
                                                </MultiDataString>
                                            </Data>
                                            <HorizontalAlignment>Center</HorizontalAlignment>
                                            <VerticalAlignment>Middle</VerticalAlignment>
                                            <Size>Small</Size>
                                            <TextPosition>Bottom</TextPosition>
                                            <FontInfo>
                                                <FontName>Arial</FontName>
                                                <FontSize>8</FontSize>
                                                <IsBold>False</IsBold>
                                                <IsItalic>False</IsItalic>
                                                <IsUnderline>False</IsUnderline>
                                                <FontBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </FontBrush>
                                            </FontInfo>
                                            <ObjectLayout>
                                                <DYMOPoint>
                                                <X>0.5960291</X>
                                                <Y>0.23</Y>
                                                </DYMOPoint>
                                                <Size>
                                                <Width>0.4339712</Width>
                                                <Height>1.559732</Height>
                                                </Size>
                                            </ObjectLayout>
                                            </BarcodeObject>
                                            <BarcodeObject>
                                            <Name>IBarcodeObject35</Name>
                                            <Brushes>
                                                <BackgroundBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="1" G="1" B="1"></Color>
                                                </SolidColorBrush>
                                                </BackgroundBrush>
                                                <BorderBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </BorderBrush>
                                                <StrokeBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </StrokeBrush>
                                                <FillBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </FillBrush>
                                            </Brushes>
                                            <Rotation>Rotation90</Rotation>
                                            <OutlineThickness>1</OutlineThickness>
                                            <IsOutlined>False</IsOutlined>
                                            <BorderStyle>SolidLine</BorderStyle>
                                            <Margin>
                                                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
                                            </Margin>
                                            <BarcodeFormat>Code128A</BarcodeFormat>
                                            <Data>
                                                <MultiDataString>
                                                <DataString>${id}</DataString>
                                                </MultiDataString>
                                            </Data>
                                            <HorizontalAlignment>Center</HorizontalAlignment>
                                            <VerticalAlignment>Middle</VerticalAlignment>
                                            <Size>Small</Size>
                                            <TextPosition>Bottom</TextPosition>
                                            <FontInfo>
                                                <FontName>Arial</FontName>
                                                <FontSize>8</FontSize>
                                                <IsBold>False</IsBold>
                                                <IsItalic>False</IsItalic>
                                                <IsUnderline>False</IsUnderline>
                                                <FontBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </FontBrush>
                                            </FontInfo>
                                            <ObjectLayout>
                                                <DYMOPoint>
                                                <X>0.03333335</X>
                                                <Y>1.834058</Y>
                                                </DYMOPoint>
                                                <Size>
                                                <Width>0.4339712</Width>
                                                <Height>1.559732</Height>
                                                </Size>
                                            </ObjectLayout>
                                            </BarcodeObject>
                                            <BarcodeObject>
                                            <Name>IBarcodeObject36</Name>
                                            <Brushes>
                                                <BackgroundBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="1" G="1" B="1"></Color>
                                                </SolidColorBrush>
                                                </BackgroundBrush>
                                                <BorderBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </BorderBrush>
                                                <StrokeBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </StrokeBrush>
                                                <FillBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </FillBrush>
                                            </Brushes>
                                            <Rotation>Rotation90</Rotation>
                                            <OutlineThickness>1</OutlineThickness>
                                            <IsOutlined>False</IsOutlined>
                                            <BorderStyle>SolidLine</BorderStyle>
                                            <Margin>
                                                <DYMOThickness Left="0" Top="0" Right="0" Bottom="0" />
                                            </Margin>
                                            <BarcodeFormat>Code128A</BarcodeFormat>
                                            <Data>
                                                <MultiDataString>
                                                <DataString>${id}</DataString>
                                                </MultiDataString>
                                            </Data>
                                            <HorizontalAlignment>Center</HorizontalAlignment>
                                            <VerticalAlignment>Middle</VerticalAlignment>
                                            <Size>Small</Size>
                                            <TextPosition>Bottom</TextPosition>
                                            <FontInfo>
                                                <FontName>Arial</FontName>
                                                <FontSize>8</FontSize>
                                                <IsBold>False</IsBold>
                                                <IsItalic>False</IsItalic>
                                                <IsUnderline>False</IsUnderline>
                                                <FontBrush>
                                                <SolidColorBrush>
                                                    <Color A="1" R="0" G="0" B="0"></Color>
                                                </SolidColorBrush>
                                                </FontBrush>
                                            </FontInfo>
                                            <ObjectLayout>
                                                <DYMOPoint>
                                                <X>0.03333335</X>
                                                <Y>0.23</Y>
                                                </DYMOPoint>
                                                <Size>
                                                <Width>0.4339712</Width>
                                                <Height>1.559732</Height>
                                                </Size>
                                            </ObjectLayout>
                                            </BarcodeObject>
                                        </LabelObjects>
                                        </DynamicLayoutManager>
                                    </DYMOLabel>
                                    <LabelApplication>Blank</LabelApplication>
                                    <DataTable>
                                        <Columns></Columns>
                                        <Rows></Rows>
                                    </DataTable>
                                    </DesktopLabel>`;
}