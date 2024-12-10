/*Realiza un programa que utilice Selenium WebDriver para lo siguiente: (2 puntos)
● Ingresa al enlace: https://www.pino.mx/2808/ext/lista.php
● Lee el valor del campo con la etiqueta “Leer el registro”.
● Dependiendo del número de registro, ingresa los datos del formulario y envíalo.
● Muestra en consola/GUI todos los datos y el ID de Acceso */
package com.example;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class chrome {
    public static void main(String[] args) {
        System.getProperty("webdriver.chrome.driver","C:\\Users\\rocae\\Documents\\CorventWeb\\ESTUDIAR\\Exam\\demo\\src\\main\\resources\\chromedriver.exe");
        WebDriver driver =new ChromeDriver();
        driver.get("http://www.pino.mx/2308/ti/lista.php");
        String registro = driver.findElement(By.name("leer")).getAttribute("value");
        int convertido = Integer.parseInt(registro);
        for(int i=1; i<=10; i++){
            if (convertido ==i) {
               String  matricula =driver.findElement(By.name("mat_" + i)).getAttribute("value");
               String  nombre =driver.findElement(By.name("nom_" + i)).getAttribute("value");
               String  apellido =driver.findElement(By.name("ape_" + i)).getAttribute("value");

               driver.findElement(By.id("matricula")).sendKeys(matricula);
               driver.findElement(By.id("nombre")).sendKeys(nombre);
               driver.findElement(By.id("apellido")).sendKeys(apellido);
               driver.findElement(By.name("Enviar")).click();
               String confirmacion =driver.findElement(By.id("acceso")).getAttribute("value");
               System.out.println(matricula + nombre + apellido+ confirmacion);



            
            }

        }
        

    }
    
}
