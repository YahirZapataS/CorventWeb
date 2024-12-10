package com.example;

import java.util.ArrayList;
import java.util.List;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class exam {
    public static void main(String[] args) {
        System.getProperty("webdriver.chrome.driver",
                "C:\\Users\\rocae\\Documents\\CorventWeb\\ESTUDIAR\\demo\\src\\main\\resources\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();

        driver.get("http://www.pino.mx/2308/ti/lista.php");
        
          
        String codigo = driver.findElement(By.name("leer")).getAttribute("value");
        int convertido =Integer.parseInt(codigo);

        for(int i = 1; i<=10; i++){

        if (convertido == i) {
           driver.findElement(By.name("mat")).sendKeys(driver.findElement(By.name("mat_" + i)).getAttribute("value"));
           driver.findElement(By.name("nom")).sendKeys(driver.findElement(By.name("nom_" + i)).getAttribute("value"));
           driver.findElement(By.name("ape")).sendKeys(driver.findElement(By.name("ape_" + i)).getAttribute("value"));
           driver.findElement(By.name("Enviar")).click();
           
        }
            
        }
        

    }

}
