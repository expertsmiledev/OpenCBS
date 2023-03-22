package com.opencbs.loans.xml.sepa;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DebtorAgent {

    @JacksonXmlProperty(localName = "FinInstnId")
    private FinancialInstitutionIdentification financialInstitutionIdentification;
}
