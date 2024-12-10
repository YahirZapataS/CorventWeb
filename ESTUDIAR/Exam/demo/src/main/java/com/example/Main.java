package com.example;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world!");
        System.getProperty("webdriver.chrome.driver", "C:\\Users\\rocae\\Documents\\CorventWeb\\ESTUDIAR\\Exam\\demo\\src\\main\\resources\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.get("www.google.com");

        
    }
}