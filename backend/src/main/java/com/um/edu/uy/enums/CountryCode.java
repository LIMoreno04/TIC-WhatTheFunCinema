package com.um.edu.uy.enums;

import lombok.Getter;

@Getter
public enum CountryCode {
    UY("Uruguay", "+598"),
    US("United States", "+1"),
    BR("Brazil", "+55"),
    AR("Argentina", "+54"),
    CL("Chile", "+56"),
    CA("Canada", "+1"),
    MX("Mexico", "+52"),
    GB("United Kingdom", "+44"),
    DE("Germany", "+49"),
    FR("France", "+33"),
    IT("Italy", "+39"),
    JP("Japan", "+81"),
    CN("China", "+86"),
    IN("India", "+91"),
    AU("Australia", "+61"),
    OTHER("Other", "+00");

    private final String countryName;
    private final String celCode;

    CountryCode(String countryName, String celCode) {
        this.countryName = countryName;
        this.celCode = celCode;
    }

}


