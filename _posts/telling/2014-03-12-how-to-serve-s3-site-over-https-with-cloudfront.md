---
title: "How to Serve Your S3 Hosted Site over HTTPS with CloudFront"
subtitle: "Many Thanks to Alistair@AWS"
description: "We'll go over how to set up a free SSL certificate with StartSSL, upload it to AWS IAM store, and configure our CloudFront distribution to serve our Amazon S3 hosted website."

layout: blog
category: writing
comments: true

typeface: sans-serif
---

Serving websites over HTTPS has become a pervasive norm that not doing so can be a cause for concern for the average web user when they don't see that green lock in the address bar. While it's not *necessarily necessary* for a site consisting of only static files to encrypt its connection---because there's no authentication or transactions involved---I would argue that giving your users the peace of mind that there's a measure of privacy and protection against eavesdropping is a factor in providing a better user experience, even for a simple blog.

For a while people like me who hosted their sites on S3 couldn't get SSL support on CloudFront without having to shell out $600 per month. Luckily, Amazon recently introduced the feature to serve a CloudFront distribution through HTTPS with your own SSL certificates on a custom domain using what is called Server Name Indication (SNI). All modern browsers support SNI, but you can check the [list of non-supported clients on Wikipedia](https://en.wikipedia.org/wiki/Server_Name_Indication#No_support) if you're crazy hardcore about coverage.

In this tutorial we're going to serve a static site hosted on Amazon S3 distributed with CloudFront over HTTPS, all for the price of zero. The steps are as follows:

* Get a free SSL certificate from StartSSL.
* Upload the SSL certificate to the AWS IAM store.
* Configure our CloudFront distribution to serve our S3 hosted site over HTTPS only.

I'm going to assume that you have a static website hosted on S3 and distributed with CloudFront already. If not, Paul Stamatiou has [an excellent guide on hosting your static site on Amazon S3 with CloudFront](http://paulstamatiou.com/hosting-on-amazon-s3-with-cloudfront/). Once that's done, come back here to get set up with HTTPS.

## Getting a Free SSL Certificate from StartSSL

We're going to start by getting a free(!) Class 1 SSL certificate from StartCom's StartSSL site. This process is made a little painful by a pretty unintuitive user interface, so bear with me here.

![StartSSL Welcome Screen Features]({{ site.cdn_url }}posts/2014/03/startssl-welcome-features.png)
{:.breakout}

Navigate to [StartSSL's home page](https://www.startssl.com) and go through the sign-up process. The registration form should be pretty self-explanatory; you should try to be as accurate here as the point of an SSL certificate is to verify a real identity. If you plan to upgrade to higher class certification down the road, you'll also have to go through additional identity checks. Registering for Class 1 certificates is relatively painless, as only the domain name and email need verification.

Note that you should only use their free SSL offering if you're running a small personal site, which is the case here. The paid tiers beyond Class 1 offer more robust features like wild card support (`*.domain.com`) and are targeted for web services and e-commerce sites. Since we're just hosting a bunch of static files, the higher classes are overkill.

After verifying with the code sent to your email, you should choose the "2048 (High Grade)" option when generating your private key. On the next screen hit "Install" to install the client certificate into your browser. It's how you're going to authenticate with StartSSL in the future for login purposes and it gives them a way to verify your identity. I would suggest you backup the certificate to an external device, but if you're lazy like me you can always just file it away on Dropbox---just know that it's not the most secure method.

Follow the onscreen directions to backup your client certificate. For the sake of convenience I'll reproduce them here for Chrome, Safari, and Firefox:

> Google Chrome: Click on the "Options" icon in the upper left. Select "Settings" from the menu. Click on "Advanced Settings" and then in the HTTPS/SSL section, click on the "Manage certificates..." button. Select the certificate(s) you want to export, click on the "Export..." button and follow the prompts from the Export Certificate Wizard that pops up. Make sure to include the private key as well, export as .p12 file.
>
> Firefox: Select "Preferences \| Options" -> "Advanced" -> "Encryption" -> "View Certificates", choose the "Your Certificates" tab and locate your client certificate from the list. The certificate will be listed under StartCom. Select the certificate and click on "Backup", choose a name for this backup file, provide a password and save it at a known location. Now you should either burn this file to a CD ROM or save it on a USB stick or smart card. Thereafter delete this file from your computer.
>
> Safari (on OS X): Select the private key and the certificate together in your keychain and export as a PKCS12 file.

You'll be redirected back to the home page, at which point you should try logging in by clicking on the icon with the photo and keys on the upper right. (Like I said, the UI is a little unintuitive.)

![StartSSL Navigation Bar]({{ site.cdn_url }}posts/2014/03/startssl-topnavbar.png)

Log in by selecting your installed certificate from the dropdown (at least in the case of Chrome and Safari); it should start with the email address you registered with StartSSL. Once logged in, find the "Validations Wizard" tab and validate your domain (i.e., the one you're hosting your website with) through a standard verification email procedure.

Now we're ready to generate a server certificate for use with AWS. Go to the "Certificates Wizard" tab and select "Web Server SSL/TLS Certificate" from the "Certificate Target" dropdown list. On the next page, make sure to click "Skip", since we're going to generate our own private key and certificate request. The reason is because you can't upload private keys with passphrases to IAM, and StartSSL requires a passphrase when generating private keys.

Open up your terminal. If you don't have the OpenSSL package, you'll need to [download the source and build the package](http://www.openssl.org/source/). If you're on OS X and have Homebrew installed, `brew install openssl` works splendidly.

Create a unique private key for our Certificate Signing Request (CSR) in the command line with the following:

    $ openssl genrsa 2048 > private-key.pem

You should replace `private-key.pem` with your own file name. Amazon recommends using an RSA key that is 2048 bits. Next we need to create our CSR, which is the file you send to a certificate authority (CA) like StartSSL to apply for a server certificate. Enter the following command in the terminal:

    $ openssl req -new -key private-key.pem -out csr.pem

    You are about to be asked to enter information that will be incorporated
    into your certificate request.
    What you are about to enter is what is called a Distinguished Name or a DN.
    There are quite a few fields but you can leave some blank
    For some fields there will be a default value,
    If you enter '.', the field will be left blank.

Follow the directions in the output to generate your CSR. **When entering the Common Name, note that it's typically your host plus domain name (e.g., wikichen.is)**. It should be the domain name for which you're requesting the server certificate.

Back to the browser you should now be on the "Submit Certificate Request (CSR)" page. Copy and paste everything in the CSR file you just generated into the text box. It should look something like this:

~~~~~
-----BEGIN CERTIFICATE REQUEST-----
MIIC3DCCAcQCAQAwgZYxCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJDQTEUMBIGA1UE
BxMLRGlhbW9uZCBCYXIxITAfBgNVBAoTGEludGVybmV0IFdpZGdpdHMgUHR5IEx0
ZDEZMBcGA1UEAxMQSm9uYXRoYW4gRS4gQ2hlbjEmMCQGCSqGSIb3DQEJARYXam9u
YXRoYW5lY2hlbkBnbWFpbC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK
AoIBAQDkFDXf1fbLSB0bndh3vwFdYY4+eDZwth1/4uPijyuKv4+AAVjyQz+mOC5s
QWtQzRFCfZTPJx2KTgQw601I2UoR1FkuutMb4yGR7Ljn+9VEP6+7V+ekfbgnXV0q
W8jv8MSPtFNlBSTqZUk8TZyimZ3W/ECbHunZWxAN5YQ7R2CCIY8VJ/4ParsG1KEb
+1QRIQa6LKHfYMzJ4kAJf2ebZX9Gi0MOwvbX6SuZYgCoTBSDRfnb8tF0IMwnIkxQ
vOL6G7HecxEZpTNYRGsl9AHfpV0GVfc+l324U3msRBun/LrCM7naqPMwhjvmZZMB
S/geSM8D36uj36w7U6qOT9eWBm8lAgMBAAGgADANBgkqhkiG9w0BAQUFAAOCAQEA
sqV416srUERm79bMH6DS50J9AI3LGMxfCutxKpjMp1TCKgCsr8otmSSikDg4rzJe
gPuVlaXfR9xdtiSg2XR44Sdw+AuU6wbUJY0LxHYJM2B3CovU8WQKwYpxgPmflqJj
68Rj/Mt6cb5NAWzmCD+QC9l2a/DBPTrlKu7Fj10GeT+cy7xaRFKqo9OG1pM4s1mb
f5T+lLQ0B5DglhUslqjSP6S5bYb+oMNHuenwVkHG1JkyIn3SiR404l5gEMQJolpK
L3CJoTnp7Gxqw6EV/8HgTSGwCMh4cqeShlX12PWmLtSWPZ9u1FVnilzoktuM3wDU
buaXwIxjL9iu5pMfbt+lEA==
-----END CERTIFICATE REQUEST-----
~~~~~

Upon submission you'll be forwarded to the Certificate Request Received page. Keep going and add your domain on the next page. When asked to add one subdomain to the certificate, put in `wwww`. The root domain is included by default, and you'll want the option for CloudFront to serve your site through HTTPS on your `www` subdomain as well.

Continue through the "Ready Processing Certificate" page and if all goes well you should get an email confirming that your SSL certificate has been issued. Go back to the "Tool Box" tab on StartSSL and select "Retrieve Certificate" from the left menu. Select your certificate from the dropdown list and you'll be able to copy down your certificate. Save it in a file called `ssl.crt`.

Note: On my first time through I recall the certificate approval being instantaneous, which then redirected me to a page where I could easily download the `ssl.crt` file, as well as the CA's root and intermediary certificates. If you see that page instead, just download everything to a safe place.
{:note}

Now on the same left menu head over to "StarCom CA Certificates". You'll want to download "StarCom Root CA (PEM encoded)" as well as "Class 1 Intermediate Sever CA". These two certificates are used to build a certificate chain (or a server certificate bundle).

Rather than sift through the entire bundle file provided by StartSSL and remove the unnecessary intermediaries that aren't in the trust path, it's faster to build our own, since there are only two certificates in question.

Create a new file called `ca-bundle.pem` and carefully copy into it the contents of both the root certificate (`ca.pem`) and intermediate certificate (`sub.class1.server.ca.pem`) to match the following format:

~~~~~
-----BEGIN CERTIFICATE-----
Intermediate certificate
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
Root certificate
-----END CERTIFICATE-----
~~~~~


## Uploading Certificate to AWS IAM Store

Since there's no web interface for accessing IAM, you'll have to use the AWS CLI to upload your server certificate. There's a [guide to get set up on the AWS documentation site](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html), but if you're on OS X, simply use Homebrew `brew install aws-iam-tools` which gives you access to the `iam-servercertupload` command.

Make sure you have these three files:

* the server certificate in PEM format (`ssl.crt`)
* the private key in PEM format (`private-key.pem`)
* the certificate chain file (`ca-bundle.pem`)

Use the following to upload the certificate to IAM for the AWS CLI:

    aws iam upload-server-certificate --server-certificate-name MyStartSSLCert --certificate-body ssl.crt --private-key private-key.pem --certificate-chain ca-bundle.pem --path /cloudfront/

Use this line if you're using brewed `aws-iam-tools`:

    iam-servercertupload -b ssl.crt -k private-key.pem -c ca-bundle.pem -s MyStartSSLCert -p /cloudfront/

Rename `MyStartSSLCert` to whatever you want to call your certificate on IAM. The path flag is especially important here if you want to use the certificate with Amazon CloudFront, otherwise it would be inaccessible. The CLI returns pretty specific errors if your certificate fails to upload. Recheck your bundle file, because that's where I had the most trouble, though if you followed the tutorial up to this point you should be fine.


## Configuring CloudFront for HTTPS

On your [CloudFront Management Console](https://console.aws.amazon.com/cloudfront/home) go to "Distribution Settings". On the General tab, you'll want to edit the settings to mach the screenshot below.

![CloudFront Edit Distribution Settings]({{ site.cdn_url }}posts/2014/03/cloudfront-edit-distribution-settings.png)
{:.breakout}

Your certificate should show up in the dropdown list next to "Custom SSL Certificate". Also make sure to select "Only Clients that Support Server Name Indication (SNI)" for Custom SSL Client Support, since this is the only option that enables your own custom SSL certificates. Submit and head over to the "Origins" tab and go to the settings of your S3 origin.

I wasted hours figuring this out, so make sure that under "Origin Protocol Policy" it's set to "HTTP Only". The comprehensive reasoning is outlined on [my StackOverflow question's answer](http://stackoverflow.com/questions/22282137/cloudfront-error-when-serving-over-https-using-sni/22294764#22294764), but basically S3 static website hosting doesn't support the HTTPS protocol, so you want to make sure CloudFront isn't forwarding any HTTPS requests to your S3 bucket. Once that's done, submit and make one last stop to the "Behaviors" tab.

You want to modify Viewer Protocol Policy to whichever behavior you want. For my purposes, I wanted all traffic redirected to HTTPS, so I have it set to "Redirect HTTP to HTTPS". "HTTP and HTTPS" obviously allows both, and "HTTPS Only" would return an error page when you try to access the site through HTTP.

If you use a tool like the `s3_website` gem to configure and deploy your S3 site, be wary about using the `s3_website apply cfg` command, as it'll return  both Origin and Viewer Protocol Policies to their default configurations, which you'll then have to change again on the web console. I'm in the process of submitting a pull request to the gem to add more CF config options to the CLI, but for now, know that this behavior occurs.

Hopefully your site works over HTTPS now. You can always use [this SSL Checker](http://www.sslshopper.com/ssl-checker.html) to verify that it's working. All in a day's work.

If there are any issues with the post or you run into any problems, please [let me know on Twitter](https://twitter.com/wikichen).
